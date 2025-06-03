Below is a checklist of everything that still needs to be added or corrected so that your current code actually works end-to-end with HTTP-only cookies, signed JWTs, and route protection. For each item, you’ll see:

1. **What’s currently in your code**
2. **What’s missing or wrong**
3. **Exactly how to fix it (with code snippets)**

---

## 1. Environment Variables & `config.ts` Type-Safety

### 1.1. Problem: `config.SESSION_SECRET` and `config.EXPIRATION_TIME` Are Typed as `unknown`

* **What you have:**

  ```ts
  // config.ts
  function getEnvVar(key: string, fallback?: unknown): unknown {
    const value = process.env[key];
    if (value !== undefined) return value;
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }

  export const config = {
    SESSION_SECRET: getEnvVar("SESSION_SECRET", undefined),
    EXPIRATION_TIME: getEnvVar("EXPIRATION_TIME", 3600000)
  };
  ```

  Because `getEnvVar()` returns `unknown`, both `SESSION_SECRET` and `EXPIRATION_TIME` end up as `unknown` at runtime. That means when you do:

  ```ts
  const secretKey = config.SESSION_SECRET;
  const encodedKey = new TextEncoder().encode(secretKey);
  ```

  TypeScript will complain (and at runtime you might get a weird cast) because `secretKey` might not be a string, and `EXPIRATION_TIME` might be a string.

* **Why it matters:**

  * `SignJWT(payload).sign(...)` expects a `Uint8Array`‐encoded key, so `secretKey` must be a string.
  * `EXPIRATION_TIME` must be a `number` (milliseconds). If you accidentally get the raw string from `process.env.EXPIRATION_TIME`, your arithmetic (`Date.now() + config.EXPIRATION_TIME`) will do string concatenation (“169…3600000”) instead of adding numbers.

* **How to fix it:**

  1. **Narrow `getEnvVar()` to return either `string` or the fallback type**.
  2. **Immediately coerce/parse `EXPIRATION_TIME` into a number**.

  Replace your `config.ts` with something like:

  ```ts
  // config.ts
  export type Locale = (typeof locales)[number];
  export const locales = ["pl"] as const;
  export const defaultLocale: Locale = "pl";

  function getEnvVar(key: string, fallback?: string): string {
    const value = process.env[key];
    if (value !== undefined) return value;
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }

  // SESSION_SECRET must be a string
  const SESSION_SECRET = getEnvVar("SESSION_SECRET", "dev‐fallback‐secret‐do‐not‐use");
  // EXPIRATION_TIME must be a number of ms
  const EXPIRATION_TIME_MS = Number(
    getEnvVar("EXPIRATION_TIME", String(3600000))
  );
  if (Number.isNaN(EXPIRATION_TIME_MS)) {
    throw new Error("ENV variable EXPIRATION_TIME must be a valid number (milliseconds)");
  }

  export const config = {
    SESSION_SECRET,       // string
    EXPIRATION_TIME: EXPIRATION_TIME_MS, // number
  };
  ```

  Then, in your `.env.local` (project root), you should have:

  ```
  SESSION_SECRET=some‐very‐long‐random‐string‐at‐least‐32‐chars
  EXPIRATION_TIME=3600000
  ```

  > **Why this helps:**
  >
  > * Now `config.SESSION_SECRET` is guaranteed to be a string.
  > * `config.EXPIRATION_TIME` is guaranteed to be a number (milliseconds).
  > * No more “`unknown`” types leaking into `session.ts`.

---

## 2. `sessions.ts` Payload & Expiration Logic

### 2.1. Problem: You’re putting a `Date` into the JWT payload and hard‐coding `"1h"` instead of using `config.EXPIRATION_TIME`

* **What you have in `sessions.ts`:**

  ```ts
  type SessionPayload = {
    userId: string;
    expiresAt: Date;
  };

  export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + config.EXPIRATION_TIME);
    const session = await encrypt({ userId, expiresAt });
    const cookie = await cookies();

    cookie.set("session", session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
    });
  }

  export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(encodedKey);
  }
  ```

  **Two issues** here:

  1. **`expiresAt: Date` in the JWT payload**

     * `SignJWT` will try to `JSON.stringify()` that payload. Serializing a `Date` object ends up as an ISO string (e.g. `"2025-06-02T12:34:56.789Z"`). That’s okay, but whenever you read `payload.expiresAt` after `jwtVerify`, you’ll get a string, not a `Date` type. If you want to do any comparison (`payload.expiresAt < Date.now()`), you either have to do `new Date(payload.expiresAt)` or store it as a `number` (timestamp).

  2. **`.setExpirationTime("1h")` is hard‐coded**

     * You already computed `expiresAt` based on `config.EXPIRATION_TIME` (which is in ms), but then you ignore it and tell `SignJWT` to expire in exactly 1 hour. If `config.EXPIRATION_TIME` was 2 hours, your cookie would expire at 2 hours but the JWT’s `exp` claim is only at 1 hour. Or if `config.EXPIRATION_TIME` was just 30 minutes, your cookie would cling for 30 minutes while the JWT is valid for an hour. These must match.

#### 2.1.1. How to fix #1: Change `expiresAt` to a `number` or ISO‐string

* **Modify the payload type so it is explicitly a timestamp (number) instead of `Date`:**

  ```ts
  // sessions.ts

  type SessionPayload = {
    userId: string;
    expiresAt: number; // store as milliseconds since epoch
  };
  ```

* **When you call `encrypt`, pass `expiresAt.getTime()`:**

  ```ts
  export async function createSession(userId: string) {
    // TTL in ms from config.EXPIRATION_TIME
    const ttl = config.EXPIRATION_TIME;
    const expiresDate = new Date(Date.now() + ttl);

    const payload: SessionPayload = {
      userId,
      expiresAt: expiresDate.getTime(),
    };

    // Now sign with exactly TTL seconds:
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${Math.floor(ttl / 1000)}s`)
      .sign(encodedKey);

    const cookieStore = cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresDate,
    });
  }
  ```

  * Notice that we replaced `.setExpirationTime("1h")` with `.setExpirationTime(\`\${Math.floor(ttl/1000)}s\`)`. That ensures the JWT’s `exp\` matches exactly when your cookie expires.
  * We also added `sameSite: "lax"` and only set `secure: true` if `NODE_ENV === "production"`. (In development on `localhost`, `secure: true` will cause some browsers not to set the cookie; in production behind HTTPS, you do want it.)

#### 2.1.2. How to fix #2: Remove the hard-coded `"1h"` and use the TTL from `config`

* The snippet above already does that with `.setExpirationTime(\`\${Math.floor(ttl/1000)}s\`)`, where `ttl = config.EXPIRATION\_TIME\`.

* **Revised `sessions.ts` in full:**

  ```ts
  // sessions.ts
  "use server"; // must be at the very top

  import { SignJWT, jwtVerify, errors as joseErrors } from "jose";
  import { cookies } from "next/headers";
  import { config } from "./config";

  const secretKey = config.SESSION_SECRET; // now guaranteed string
  const encodedKey = new TextEncoder().encode(secretKey);

  type SessionPayload = {
    userId: string;
    expiresAt: number; // milliseconds since epoch
  };

  export async function createSession(
    userId: string,
    rememberMe: boolean = false
  ) {
    // If you want “Remember me” to extend expiration, adjust `ttl` here:
    const baseTtl = config.EXPIRATION_TIME; // e.g. 3600000 ms (1h)
    const ttl = rememberMe ? baseTtl * 24 * 30 : baseTtl; // 30 days if remembered

    const expiresDate = new Date(Date.now() + ttl);

    const payload: SessionPayload = {
      userId,
      expiresAt: expiresDate.getTime(),
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${Math.floor(ttl / 1000)}s`)
      .sign(encodedKey);

    const cookieStore = cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresDate,
    });
  }

  export async function deleteSession() {
    const cookieStore = cookies();
    cookieStore.delete("session");
  }

  export async function decrypt(
    sessionToken: string | undefined = ""
  ): Promise<SessionPayload | null> {
    if (!sessionToken) return null;
    try {
      const { payload } = await jwtVerify(sessionToken, encodedKey, {
        algorithms: ["HS256"],
      });
      // NOTE: `payload` is now an object with { userId: string, expiresAt: number, iat: number, exp: number }
      const session = payload as SessionPayload;
      return session;
    } catch (err) {
      // Optionally inspect: if (err instanceof joseErrors.JWTExpired) { … }
      console.error("JWT validation failed:", err);
      return null;
    }
  }
  ```

  > **Key points:**
  >
  > * `type SessionPayload.expiresAt` is now a timestamp (`number`).
  > * We use `Math.floor(ttl/1000) + "s"` so that `exp` claim in the JWT matches the same TTL you used for the cookie.
  > * We added a `rememberMe` parameter (see next section).
  > * We guard `secure: process.env.NODE_ENV === "production"`. Otherwise in dev on plain HTTP, cookies won’t be set.

---

## 3. Handling “Remember Me” in `actions.ts`

### 3.1. Problem: `rememberMe` Is Never Passed into `createSession`

* **What you have in `actions.ts`:**

  ```ts
  export async function login(formData: FormValues) {
    if (formData.loginOrEmail !== testUser.email || formData.password !== testUser.password) {
      alert("User does not exist. Try again.");
      return;
    }
    await createSession(testUser.id);
    redirect("/dashboard");
  }
  ```

  Even though your `FormValues` includes `rememberMe: boolean`, you always call `createSession(testUser.id)` without passing that flag. So the checkbox does nothing.

* **Why it matters:**

  * If a user ticks “Remember me,” the intent is usually to keep them logged in for longer than 1 hour. But your code always uses the default TTL (1 hour), ignoring that checkbox.

* **How to fix it:**

  1. Change your `createSession` signature (in `sessions.ts`) to accept a `rememberMe` boolean (we already adjusted above).
  2. Pass `formData.rememberMe` from the `login(...)` action.

  ```ts
  // actions.ts
  "use server";

  import { createSession, deleteSession } from "./sessions"; // adjust path as needed
  import { redirect } from "next/navigation";

  export type FormValues = {
    loginOrEmail: string;
    password: string;
    rememberMe: boolean;
  };

  const testUser = {
    id: "1",
    email: "contact@cosdensolutions.io",
    password: "12345678",
  };

  export async function login(formData: FormValues) {
    if (
      formData.loginOrEmail !== testUser.email ||
      formData.password !== testUser.password
    ) {
      // NOTE: `alert()` in server‐side code does nothing. See next section.
      throw new Error("Invalid credentials");
    }
    // Pass the rememberMe flag down to createSession:
    await createSession(testUser.id, formData.rememberMe);
    redirect("/dashboard");
  }

  export async function logout() {
    await deleteSession();
    redirect("/auth/login");
  }
  ```

* **Additional note:**

  * In a Next.js server action, `alert("…")` will not display anything in the user’s browser, because it’s running on the server. Instead, throw an error or return a value. Later, your client‐side form can catch that error and show the message. (I’ll cover that in section 7.)

---

## 4. Correct Import Paths for `sessions.ts` & `actions.ts`

### 4.1. Problem: Inconsistent File Location vs. Import Paths

* **Your code currently:**

  ```
  sessions.ts                 ← presumably at project root
  actions.ts                  ← presumably at project root
  middleware.ts               ← presumably at project root
  loginform.tsx               ← inside some component folder
  config.ts                   ← presumably at project root
  ```

  But inside `middleware.ts` you do:

  ```ts
  import { decrypt } from "./services/session";
  ```

  Yet your file is named `sessions.ts` at the root, not in `services/session.ts`.

* **Why it matters:**

  * TypeScript/Next.js will throw “module not found” if `./services/session` does not exist.
  * Similarly, in `actions.ts` you may be importing from the wrong relative path.

* **How to fix it:** Decide on one of these two approaches:

  1. **Move/rename `sessions.ts` → `services/session.ts`**

     * Create a folder called `services/` at the project root.
     * Move `sessions.ts` into `services/` and rename it to `session.ts`.
     * Now you have `services/session.ts` and `services/config.ts`.
     * Update all imports to use `./services/session` (from root) or `@/services/session` (if you have `tsconfig.json` set up with `baseUrl: "."` and `paths: { "@/*": ["*"] }`).

     Example:

     ```
     /
     ├─ app/                  # if using App Router
     ├─ pages/                # if using Pages Router
     ├─ services/
     │   ├─ session.ts
     │   └─ config.ts
     ├─ components/
     │   ├─ loginform.tsx
     │   └─ ...
     ├─ middleware.ts
     ├─ package.json
     └─ tsconfig.json
     ```

     * In `middleware.ts`, change:

       ```ts
       import { decrypt } from "./services/session";
       ```
     * In `actions.ts`, change:

       ```ts
       import { createSession, deleteSession } from "./services/session";
       ```

  2. **Keep `sessions.ts` at the root, but change imports to `./sessions`**

     * If you don’t want a `services/` folder, then in every file that says `import { … } from "./services/session"`, swap it to:

       ```ts
       import { createSession, deleteSession, decrypt } from "./sessions";
       ```

     * In `actions.ts`:

       ```ts
       import { createSession, deleteSession } from "./sessions";
       ```

     * In `middleware.ts`:

       ```ts
       import { decrypt } from "./sessions";
       ```

  > **Pick one convention**—either keep all your “service” code under `services/` or keep it at the project root. The important part is that the import path matches the actual file system.

---

## 5. Fixing Middleware Cookie Access & Route Matching

### 5.1. Problem: Calling `await cookies()` Inside `middleware.ts`

* **What you have:**

  ```ts
  import { cookies } from "next/headers";
  import { NextRequest, NextResponse } from "next/server";
  import { decrypt } from "./services/session";

  const protectedRoutes = ["/dashboard"];
  const publicRoutes = ["/auth/login"];

  export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtected = protectedRoutes.includes(path);
    const isPublic = publicRoutes.includes(path);

    const cookie = await cookies();
    const cookieValue = cookie.get("session")?.value;
    const session = await decrypt(cookieValue);

    if (isProtected && !session?.userId) {
      return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
    }
    if (isPublic && session?.userId) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.next();
  }
  ```

  **Issues**:

  1. **`cookies()` is a Server-Component helper, not for middleware**

     * In **middleware**, you must read cookies from the request object itself: `req.cookies.get("session")?.value`.
     * Calling `await cookies()` inside a middleware function will actually error, because `cookies()` is only valid in Server Components (or `app/route.ts`, not in `middleware.ts`).

  2. **Routes are matched EXACTLY (`"/dashboard"`)**

     * If you later add `/dashboard/settings` or `/dashboard/profile`, `protectedRoutes.includes(path)` will be false, so those sub‐URLs will not be protected. You need a pattern‐based check.

### 5.2. How to fix it

1. **Use `req.cookies.get(...)` to read the cookie**

   ```ts
   // middleware.ts
   import { NextRequest, NextResponse } from "next/server";
   import { decrypt } from "./services/session";

   // Protect any route under /dashboard, including /dashboard, /dashboard/foo, etc.
   const protectedPatterns = [/^\/dashboard($|\/)/];
   // Public routes under /auth/login or /auth/register (if you add register later)
   const publicPatterns = [/^\/auth\/login($|\/)/, /^\/auth\/register($|\/)/];

   export default async function middleware(req: NextRequest) {
     const path = req.nextUrl.pathname;
     const isProtected = protectedPatterns.some(rx => rx.test(path));
     const isPublic = publicPatterns.some(rx => rx.test(path));

     // In middleware, use `req.cookies` (not `cookies()` from `next/headers`)
     const token = req.cookies.get("session")?.value;
     const session = await decrypt(token);

     if (isProtected && !session?.userId) {
       return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
     }
     if (isPublic && session?.userId) {
       return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
     }
     return NextResponse.next();
   }

   // Restrict this middleware so it only runs on the patterns above:
   export const config = {
     matcher: [
       "/dashboard/:path*",   // all /dashboard routes
       "/auth/:path*",        // all /auth routes (login, register, forgot-password)
     ],
   };
   ```

   > **Why this helps:**
   >
   > * `req.cookies.get("session")` fetches the raw JWT string from the browser.
   > * We replaced the simple `includes(path)` check with `RegExp.test(...)` so that any nested route under `/dashboard` is protected.
   > * The `matcher` at the bottom ensures that middleware only runs on `/dashboard/*` and `/auth/*`, skipping every other static file, `/api/*`, etc.

---

## 6. Handling Login Errors Client-Side (No More `alert()` on Server)

### 6.1. Problem: Calling `alert()` in a Next.js server action does nothing

* **What you have in `actions.ts`:**

  ```ts
  if (formData.loginOrEmail !== testUser.email || formData.password !== testUser.password) {
    alert("User does not exist. Try again.");
    return;
  }
  ```

  * `alert()` runs in the browser, but `actions.ts` is a **server** module (`"use server"`). That code executes on the server. There is no `window.alert()` on the server—so that line is effectively a no-op. Your user will never see that message.

* **Why it matters:**

  * The user submits the form, nothing happens (no redirect, no message). They have no feedback. The form just re-renders with no error message.

### 6.2. How to fix it

1. **Throw an error (or return a failure payload) from the server action**

   * In `actions.ts`, change:

     ```ts
     if (
       formData.loginOrEmail !== testUser.email ||
       formData.password !== testUser.password
     ) {
       throw new Error("Invalid credentials");
     }
     ```

2. **Catch that error in your client component and show it**

   * In `loginform.tsx`, replace `handleSubmit(login)` with a custom `onSubmit` that does:

     1. Calls `login(formData)` in a `try/catch` block.
     2. If `login(...)` throws, catch it and set a local React state `loginError` to the error message.

   Example modification to `loginform.tsx`:

   ```tsx
   "use client";

   import { useState } from "react";
   import { HStack, Stack, Text } from "@chakra-ui/react";
   import { useForm, Controller } from "react-hook-form";
   import FormLayout from "../FormLayout";
   import { useTranslations } from "next-intl";
   import ChakraLink from "@/components/chakra-config/ChakraLink";
   import FormHeading from "../FormHeading";
   import FormInput from "../FormInput";
   import { userSchema } from "@/schemas/user";
   import GoogleButton from "../FormGoogleButton";
   import FormMainButton from "../FormMainButton";
   import FormCheckbox from "../FormCheckbox";
   import { login, FormValues } from "@/services/actions";

   export default function LoginForm() {
     const t = useTranslations("Auth.LoginPage");
     const { handleSubmit, control } = useForm<FormValues>();
     const [loginError, setLoginError] = useState<string | null>(null);

     // Custom onSubmit so we can catch server‐action errors
     const onSubmit = async (data: FormValues) => {
       try {
         // This will call the server action `login(data)`.
         await login(data);
         // If login succeeds, Next.js will redirect, so we probably never reach the next line.
       } catch (err: any) {
         // Show the error in the UI
         setLoginError(err?.message || "An unexpected error occurred.");
       }
     };

     return (
       <FormLayout>
         <form onSubmit={handleSubmit(onSubmit)}>
           <Stack spacing={2} mt={8}>
             <FormHeading
               title={t("title")}
               href="/auth/register"
               AccountText={t("noAccount.text")}
               AccountLink={t("noAccount.link")}
             />

             {loginError && (
               <Text color="red.500" fontSize="sm">
                 {loginError}
               </Text>
             )}

             {/* ... rest of your Controllers for loginOrEmail, password, rememberMe ... */}

             <Stack spacing={3}>
               <GoogleButton text={t("submitButtons.loginWithGoogle")} />
               <FormMainButton text={t("submitButtons.login")} type="submit" />
             </Stack>
           </Stack>
         </form>
       </FormLayout>
     );
   }
   ```

   > **Why this helps:**
   >
   > * The server action will `throw new Error("Invalid credentials")` on bad login.
   > * In your client, you call `login(data)` inside a `try/catch`. If it throws, you display an error banner above the form instead of silently failing.

---

## 7. Ensuring All Server Modules Are Marked `"use server"`

### 7.1. Problem: Any file that uses `cookies()`, `SignJWT`, or `redirect()` must be “server‐only”

* **What you have (partial):**

  * `sessions.ts` starts with `import "server-only";` (OK).
  * `actions.ts` starts with `"use server";` (OK).
  * **But** if you renamed or moved files, double‐check that each module still has `"use server";` as the very first line.

* **Why it matters:**

  * If you omit `"use server"` at the top of a file that calls `cookies()` or `redirect()` (which are server APIs), Next.js will complain “You cannot use next/headers in a Client Component” or similar errors.

* **How to fix it:**

  * Open **every** file that:

    1. Imports from `"next/headers"` (e.g. `cookies()`),
    2. Imports from `"next/navigation"` (i.e. `redirect()`),
    3. Imports from `"jose"` (because that’s server‐side signing/verifying).
  * Make sure the very first line is either:

    ```ts
    "use server";
    ```

    **or**

    ```ts
    import "server-only";
    ```

  For example, in `services/session.ts`, do:

  ```ts
  // services/session.ts
  "use server";

  import { SignJWT, jwtVerify } from "jose";
  import { cookies } from "next/headers";
  import { config } from "./config";
  // …rest of file…
  ```

  And in `services/actions.ts`:

  ```ts
  // services/actions.ts
  "use server";

  import { createSession, deleteSession } from "./session";
  import { redirect } from "next/navigation";
  // …rest of file…
  ```

  > **Note:**
  >
  > * If you accidentally put `"use client";` in a file that calls `cookies()` or `jwtVerify`, it will fail at build time.
  > * Conversely, if you omit `"use server";` in a file that calls `redirect()`, Next.js may think it’s a client component and complain about server APIs.

---

## 8. Adding a Logout Button / API Route

### 8.1. Problem: You have `logout()` defined in `actions.ts`, but no client or API route actually invokes it

* **What you have in `actions.ts`:**

  ```ts
  export async function logout() {
    await deleteSession();
    redirect("/auth/login");
  }
  ```

  But I don’t see anywhere in your React code that calls `logout()`. If you don’t call it, users can never actually log out.

* **How to fix it:**

  There are two main approaches:

  #### 8.1.1. Call `logout()` directly from a client component using a form

  * In a client component (e.g. `LogoutButton.tsx`), do:

    ```tsx
    // components/LogoutButton.tsx
    "use client";

    import { useRouter } from "next/navigation";

    export default function LogoutButton() {
      const router = useRouter();

      const handleLogout = async () => {
        // POST to a server action—here we assume you export `logout` as a server action
        const res = await fetch("/api/logout", { method: "POST" });
        if (res.ok) {
          router.push("/auth/login");
        } else {
          console.error("Logout failed");
        }
      };

      return (
        <button onClick={handleLogout}>Log out</button>
      );
    }
    ```

  * Create an API route at `/app/api/logout/route.ts`:

    ```ts
    // app/api/logout/route.ts
    import { deleteSession } from "@/services/session";
    import { NextRequest, NextResponse } from "next/server";

    export async function POST(req: NextRequest) {
      await deleteSession();
      // Return a JSON response or a redirect
      return NextResponse.json({ success: true });
    }
    ```

    * Now your `LogoutButton`’s `fetch("/api/logout", { method: "POST" })` will invoke that, clear the cookie server side, and respond with `{ success: true }`. The client then does `router.push("/auth/login")`.

  #### 8.1.2. Use a “form action” to call the `logout()` server action directly

  * If you want to keep `logout()` in `actions.ts` as a server action, you could do:

    ```tsx
    // components/LogoutForm.tsx
    "use client";

    import { useRouter } from "next/navigation";

    export default function LogoutForm() {
      const router = useRouter();
      return (
        <form
          action={async () => {
            // This is a Next.js server action (import from services/actions.ts)
            await logout(); // assuming you imported it
            router.push("/auth/login");
          }}
        >
          <button type="submit">Log out</button>
        </form>
      );
    }
    ```

    And at the top of `components/LogoutForm.tsx`, you must:

    ```ts
    import { logout } from "@/services/actions"; // server action import
    ```

  > **Tip:** The simpler, more decoupled way is to create a small API route (`/api/logout`) and call it from the client. That way, you don’t have to tie `logout()` directly into your React component tree.

---

## 9. Protecting the Dashboard Page on the Server Side

### 9.1. Problem: You rely solely on middleware to block `/dashboard`, but if someone calls your page’s code directly, there is no final check

* **Why it matters:**

  * Middleware runs before rendering, but if someone disables JavaScript or calls your data‐fetching endpoints directly, they might be able to see server‐rendered content. It’s good practice to re‐check the JWT inside any page that is “server‐rendered.”

* **How to fix it:**
  In your **App Router** (e.g. `app/dashboard/page.tsx`) or **Pages Router** (e.g. `pages/dashboard.tsx`), do:

  ```ts
  // app/dashboard/page.tsx
  import { cookies } from "next/headers";
  import { decrypt } from "@/services/session";
  import { redirect } from "next/navigation";

  export default async function DashboardPage() {
    const token = cookies().get("session")?.value;
    const session = await decrypt(token);

    if (!session?.userId) {
      // If the user has no valid session, redirect to login
      redirect("/auth/login");
    }

    // Now that we know the user is authenticated, render the dashboard.
    return (
      <div>
        <h1>Welcome to your dashboard, user {session.userId}!</h1>
        {/* …your dashboard UI… */}
      </div>
    );
  }
  ```

  > **Why this helps:**
  >
  > * Even if someone circumvents middleware, the page itself still checks `decrypt(...)`.
  > * `redirect(...)` from `next/navigation` in a server component will immediately send the user to `/auth/login` if the token is missing or invalid.

---

## 10. Creating an `/api/me` Endpoint (Optional, but Common)

### 10.1. Problem: Client components can’t read `cookies()` nor call `decrypt()` themselves

* **Why you might need this:**

  * Suppose you have a client‐side React component that fetches data via React Query from `/api/todos?userId=…`. How does the client figure out `userId`? Since `cookies()` and `jwtVerify()` only work on the server, you need a small API route that returns the logged‐in user’s ID or data.

* **How to fix it:** Create a file `app/api/me/route.ts` (for App Router) or `pages/api/me.ts` (for Pages Router):

  ```ts
  // app/api/me/route.ts
  import { NextRequest, NextResponse } from "next/server";
  import { cookies } from "next/headers";
  import { decrypt } from "@/services/session";

  export async function GET(req: NextRequest) {
    const token = cookies().get("session")?.value;
    const session = await decrypt(token);
    if (!session?.userId) {
      return NextResponse.json({ userId: null }, { status: 401 });
    }
    return NextResponse.json({ userId: session.userId });
  }
  ```

  * On the client, you can then do:

    ```ts
    const { data, error } = useSWR("/api/me");
    // data: { userId: string | null }
    ```

  > **Why this helps:**
  >
  > * All your client‐side code can now fetch `/api/me` to discover the current user.
  > * You never expose `SESSION_SECRET` or any sensitive signing logic on the client.

---

## 11. Package.json / Dependencies Check

### 11.1. Problem: Nothing stops you from shipping `SESSION_SECRET` to the browser unless you avoid `NEXT_PUBLIC_` prefix

* **What you have in `package.json`:**

  ```json
  "dependencies": {
    "jose": "^6.0.11",
    "next": "15.3.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    // ...
  }
  ```

* **Action items:**

  1. **Make sure you did NOT prefix `SESSION_SECRET` with `NEXT_PUBLIC_`.**
     If you name it `NEXT_PUBLIC_SESSION_SECRET`, Next.js will embed it in client bundles. You want it server‐only.

  2. **Run `npm install` (or `pnpm / yarn`)** to ensure `jose` is actually present. You already have it in dependencies, so just verify that `node_modules/jose` exists.

  3. **Check that you are on a compatible `@types/node` version** since `jose@^6.0.11` sometimes requires Node 18+. You have `"@types/node": "^20"`, so you should be fine.

  > **Side note:** You do not need any additional “dotenv” library—Next.js automatically loads `.env.local`, `.env.development`, etc.

---

## 12. (Optional) Add `sameSite`, `domain`, or `path` to Cookie Settings

### 12.1. Problem: You set only `httpOnly`, `secure`, and `expires` for the cookie

* **What you currently set:**

  ```ts
  cookie.set("session", token, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
  ```

* **What’s missing:**

  1. `sameSite: "lax"` (or `"strict"`) to mitigate CSRF.
  2. (If you ever deploy under a custom domain or subdomain) explicitly specifying `domain` or `path` might help. But for most Next.js apps, `path: "/"` is default and you can omit `domain`.

* **How to fix it (recommended cookie options):**

  ```ts
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",     // prevents some CSRF attacks
    path: "/",           // cookie is available on all paths
    expires: expiresDate,
  });
  ```

  > **Why this helps:**
  >
  > * `sameSite: "lax"` ensures that cross‐site POSTs from other origins cannot send your cookie.
  > * `path: "/"` is usually default, but it’s clearer to state it.

---

## 13. Confirming `loginform.tsx` Imports & File Placement

### 13.1. Problem: `loginform.tsx` might be importing from `@/services/actions` even though `actions.ts` sits at a different path

* **Your code in `loginform.tsx`:**

  ```ts
  import { login, FormValues } from "@/services/actions";
  ```

* **Check these things:**

  1. **If you moved `actions.ts` into `services/actions.ts`** (within a `services/` folder), then `@/services/actions` is correct (assuming your `tsconfig.json` has `baseUrl: "."` and a path alias `@/*`).
  2. **If `actions.ts` is still at the project root**, you need to change the import to `import { login, FormValues } from "../actions";` (or wherever it actually lives relative to `loginform.tsx`).

* **How to verify:**

  * From inside `loginform.tsx`, press ⌘/Ctrl+Click on `@/services/actions` in your editor. If it can’t resolve, you’ll see an error. Update the path until TypeScript/VSCode can jump to the right file.

---

## 14. Add `.env.local` to `.gitignore`

### 14.1. Problem: You did not mention a `.env.local` file in your repo structure

* **Why it matters:**

  * You need to define at least `SESSION_SECRET` and `EXPIRATION_TIME`, but you don’t want to check your secret into source control.

* **How to fix:**

  1. Create a file `/ .env.local` at the project root with:

     ```
     SESSION_SECRET=some‐very‐long‐random‐string‐here
     EXPIRATION_TIME=3600000
     ```

  2. Verify that your project’s `.gitignore` includes:

     ```
     # Next.js environment files
     .env.local
     ```

     If not, add it.

  > **Why this helps:**
  >
  > * Next.js will automatically load `.env.local` in development (and production if you configure it), but will not commit it to Git.

---

## 15. Final Sanity Checklist

By now, you should have verified all of the following:

1. **`config.ts`**

   * Exports `{ SESSION_SECRET: string; EXPIRATION_TIME: number }` with no `unknown` types.
   * Loads `process.env.SESSION_SECRET` and `process.env.EXPIRATION_TIME` correctly.

2. **`services/session.ts`** (or `sessions.ts` at the correct path)

   * Has `"use server";` at the top.
   * Defines `type SessionPayload = { userId: string; expiresAt: number }`.
   * `createSession(userId: string, rememberMe: boolean = false)`

     * Computes `ttl` based on `rememberMe`.
     * Uses `new SignJWT(payload).setExpirationTime(\`\${Math.floor(ttl/1000)}s\`)\`.
     * Sets cookie with `httpOnly`, `secure: (NODE_ENV === "production")`, `sameSite: "lax"`, `expires: new Date(Date.now() + ttl)`.
   * `decrypt(token: string | undefined): Promise<SessionPayload | null>`

     * Returns `null` if `token` is missing or invalid.
     * Returns `{ userId, expiresAt }` otherwise.

3. **`services/actions.ts`** (or `actions.ts` at the correct path)

   * Has `"use server";` at the top.
   * `login(formData: FormValues)`

     * Checks credentials, if invalid, `throw new Error("Invalid credentials")`.
     * Calls `await createSession(testUser.id, formData.rememberMe)`.
     * Then `redirect("/dashboard")`.
   * `logout()`

     * Calls `await deleteSession()` and then `redirect("/auth/login")`.

4. **`middleware.ts`**

   * Imports `decrypt` from the correct path (`"./services/session"` if you moved it).
   * Uses `req.cookies.get("session")`, not `await cookies()`.
   * Matches routes via regex (`/^\/dashboard($|\/)/` and `/^\/auth\/login/`, etc.).
   * Has a `config.matcher` block so it only runs on the routes you want (e.g. `"/dashboard/:path*", "/auth/:path*"`).

5. **`loginform.tsx`**

   * Has `"use client";` at the very top.
   * Imports `login` from the correct path.
   * Uses a custom `const onSubmit = async (data) => { try { await login(data) } catch (err) { setError(...) } }`.
   * Displays any `loginError` inside the JSX.

6. **Logout workflow**

   * Either via a client component (`fetch("/api/logout", { method: "POST" })`) or a client `<form action={logout}>`.
   * You have an API route (`app/api/logout/route.ts`) or server action that calls `deleteSession()` then responds.

7. **Dashboard page protection**

   * In `app/dashboard/page.tsx` (or `pages/dashboard.tsx`), you do:

     ```ts
     const token = cookies().get("session")?.value;
     const session = await decrypt(token);
     if (!session?.userId) redirect("/auth/login");
     // render dashboard
     ```

8. **`.env.local`**

   * Contains `SESSION_SECRET=…` and `EXPIRATION_TIME=…`.
   * Is listed in `.gitignore`.

9. **`package.json`**

   * Has `"jose": "^6.0.11"` installed.
   * Does not have any `dotenv` dependency (Next.js picks up `.env` automatically).
   * Does not accidentally prefix `SESSION_SECRET` with `NEXT_PUBLIC_`.

---

### Once all of these changes are in place, your app will:

1. **Set a secure, HTTP-only, sameSite cookie** named `"session"` when the user logs in.
2. **Store a JWT** (with an `expiresAt` timestamp and a built-in `exp` claim) signed by your `SESSION_SECRET`.
3. **Automatically redirect** any unauthenticated request to `/dashboard/*` → `/auth/login`.
4. **Prevent logged-in users** from seeing `/auth/login` by redirecting them to `/dashboard`.
5. **Log the user out** (delete cookie) and send them to `/auth/login` again.
6. **Let client components fetch `/api/me`** to discover `userId` if needed.
7. **Keep the user logged in** for 1 hour by default (or 30 days if they checked “Remember me”).

That completes the missing pieces. Once you apply each of these fixes, your sessions, cookies, and JWTs should work end-to-end.

