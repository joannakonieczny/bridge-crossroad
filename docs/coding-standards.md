# Coding Standards

## 📖 Language Versions

- **🇺🇸 English** - This version
- **🇵🇱 Polski** - [coding-standards.md](./pl/coding-standards.md)

## Route Management

**Always use the centralized routes file:**

```typescript
// ❌ Don't use hardcoded strings
<ChakraLink href="/auth/login">Login</ChakraLink>;
redirect("/dashboard");

// ✅ Use the ROUTES constant
import { ROUTES } from "@/routes";

<ChakraLink href={ROUTES.auth.login}>Login</ChakraLink>;
redirect(ROUTES.dashboard);
```

**Benefits of using ROUTES:**

- **Type safety**: Prevents typos in route strings
- **Refactoring**: Easy to update routes across the entire application
- **IDE support**: Autocomplete and IntelliSense for route paths
- **Consistency**: Single source of truth for all navigation
- **Documentation**: Clear overview of all available routes

**When adding new routes:**

1. Add the route to the `ROUTES` object in `/src/routes.ts`
2. Use descriptive nested structure for related routes
3. Always add `as const` assertion for type inference
4. Update the `RouteKeys` type if needed

## TypeScript Guide

- Enable strict mode
- Use proper type annotations
- **Prefer types over interfaces** - use `type` for all object shapes and component props
- Use utility types when appropriate
- Avoid `any` - use `unknown` for truly unknown data or `never`
- Use PropsWithChildren type from React if you need to pass children to component or declare component props type

**Why prefer types over interfaces:**

```typescript
// ✅ Preferred: Use type for component props
type ButtonProps = {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

// ✅ Preferred: Use type for object shapes
type User = {
  id: string;
  name: string;
  email: string;
};

// ❌ Avoid: Using interface for simple object shapes
interface ButtonProps {
  text: string;
  onClick?: () => void;
}

// ✅ Example: Using PropsWithChildren for components that accept children
import type { PropsWithChildren } from "react";
// ❌ import type { PropsWithChildren } from "react";

type ComponentWithChildrenProps = PropsWithChildren<{
  title: string;
  onClose?: () => void;
}>;

export default function ComponentWithChildren({
  title,
  onClose,
  children,
}: ComponentWithChildrenProps) {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onClose}>Close</button>
      <div>{children}</div>
    </div>
  );
}
```

## Localization & Translations Guide

### Typed Translation System

The application uses a custom wrapper over next-intl (`src/lib/typed-translations.ts`) that provides full type safety and namespace validation. **Always use the exported types `TKey` and `ITranslationKey` for type-safe translation handling.**

**Basic usage:**

```typescript
import { useTranslations, getTranslations } from "@/lib/typed-translations";
import type { TKey } from "@/lib/typed-translations";

// ✅ Client components - automatic autocomplete
const t = useTranslations();
t("common.appName"); // TypeScript checks key validity

// ✅ Server components
const t = await getTranslations();
const message = t("pages.Auth.LoginPage.title");

// ✅ Type-safe translation keys in schemas
const errorKey: string =
  "validation.pages.auth.login.password.required" satisfies TKey;
```

**Key Types Available:**

- **`TKey`** - All available translation keys as dot-notation paths (alias for `AllTranslationKeys`)
- **`ITranslationKey<T>`** - Namespace-scoped translation keys for specific namespace `T`
- **`ValidNamespaces`** - All valid namespace paths (used internally)

**Using TKey with satisfies operator:**

```typescript
import type { TKey } from "@/lib/typed-translations";

// ✅ Modern approach - use satisfies for better type checking
const schema = z.object({
  email: z
    .string()
    .email("validation.model.user.email.regex" satisfies TKey)
    .max(255, "validation.model.user.email.max" satisfies TKey),
  password: z
    .string()
    .min(8, "validation.pages.auth.register.password.min" satisfies TKey)
    .nonempty(
      "validation.pages.auth.register.password.required" satisfies TKey
    ),
});

// ❌ Deprecated approach - avoid using as ValidNamespaces
const oldWay = "some.key" as ValidNamespaces; // Less type safety
```

**Safe namespace with validation:**

```typescript
// ✅ Correct usage - namespace exists
const authT = useTranslations("pages.Auth");
authT("LoginPage.title"); // Autocomplete for pages.Auth.* keys

// ✅ Deep namespace access
const loginT = useTranslations("pages.Auth.LoginPage");
loginT("title"); // Direct access to title

// ❌ Compilation error - invalid namespace
const invalidT = useTranslations("NonExistent"); // TypeScript error!
```

**Server Actions with TKey:**

```typescript
import { returnValidationErrors } from "next-safe-action";
import type { TKey } from "@/lib/typed-translations";

export const loginAction = action
  .inputSchema(loginFormSchema)
  .action(async ({ parsedInput: formData }) => {
    const user = await findUser(formData);
    if (!user) {
      returnValidationErrors(loginFormSchema, {
        _errors: ["api.auth.login.invalidCredentials" satisfies TKey],
      });
    }
    // ... rest of logic
  });
```

**Benefits of the new TKey approach:**

- **Better type inference**: `satisfies` preserves the literal type while checking validity
- **Compile-time validation**: Invalid keys are caught during TypeScript compilation
- **IntelliSense support**: Full autocomplete for all available translation keys
- **Refactoring safety**: Renaming keys automatically updates all references
- **No runtime overhead**: Type checking happens only at compile time

**Migration from old approach:**

```typescript
// ❌ Old way - using ValidNamespaces with as assertion
"some.key" as ValidNamespaces;

// ✅ New way - using TKey with satisfies
"some.key" satisfies TKey;
```

### Translation Structure

#### Core translation namespaces

- **common** – general texts, app names, enums, global messages (e.g. months, academy, trainingGroup)
- **validation** – validation messages used in Zod schemas (e.g. validation.pages.auth.login)
- **api** – messages returned by server actions (e.g. api.auth.register.emailExists)
- **pages** – page-specific texts (placeholders, headings, descriptions, etc.)
- **components** – texts used by shared components

#### Rules for `validation` and `api`

- All translation keys must be declared with `satisfies TKey` for type safety.
- In React components, always use `useTranslationsWithFallback()` to fetch these texts.
- Translations must be simple strings – do not use objects or interpolation (e.g. `{name}`), only plain strings.
- Variables should be loaded from global config, not passed through translation keys.

#### Rules for `pages`

- Full flexibility – texts can be nested, complex, and include placeholders, descriptions, headings, etc.
- Only for texts visible on the page (UI/UX copy).

#### Nesting structure

- Nest translations according to domain logic (e.g. `pages.Auth.LoginPage`, `pages.OnboardingPage`).
- Group texts by feature or component.
- Example:
  ```ts
  pages: {
    Auth: {
      LoginPage: { ... },
      RegisterPage: { ... },
    },
    DashboardPage: { ... },
    OnboardingPage: { ... },
  }
  ```

#### Enums in `common`

- Enums (e.g. academies, training groups) should be declared in config files (e.g. `Academy`, `TrainingGroup`), and their translations in `common`:
  ```ts
  common: {
    academy: {
      [Academy.UJ]: "Uniwersytet Jagielloński",
      [Academy.AGH]: "Akademia Górniczo-Hutnicza",
      // ...
    },
    trainingGroup: {
      [TrainingGroup.BASIC]: "Podstawowa",
      // ...
    },
  }
  ```
- Always import enums and use them as translation keys for consistency and type safety.

#### Enums structure

key same as value

```js
export enum Academy {
  UJ = "UJ",
  AGH = "AGH",
  PK = "PK",
  // ...
}
```

### Good practices

- Avoid duplicating keys at the same level.
- Always group translations logically and by purpose.
- For complex components or pages, use additional nesting levels.
- **Always use typed-translations instead of next-intl directly**

### Component Patterns

```typescript
// Component structure example
"use client"; // Only when client-side features needed

import { ComponentProps } from "react"; // don't use import * as React - extremely non-optimal

type ComponentNameProps = { // same name as component + Props
  required: string;
  optional?: boolean;
  onAction?: () => void;
}

export default function ComponentName({ // export default function not arrow function
  required,
  optional = false,
  onAction
}: ComponentNameProps) {
  // Component logic
  return (
    // JSX
  );
}
```

### Server Action Pattern

```typescript
"use server";

import { action } from "@/services/action-lib";
import { userSchema } from "@/schemas/model/user/user-schema";
// or for onboarding schemas:
// import { onboardingFirstPageSchema } from "@/schemas/pages/onboarding/onboarding-schema";

export const actionName = action
  .inputSchema(userSchema) // parsing and automatic rejection when validation fails
  .action(async ({ parsedInput: myInputtedData }) => {
    // Business logic
    console.log(myInputtedData); // executes on the backend side
    return result;
  });
```

### Form Validation Pattern

```typescript
// Schema definition with typed translation keys
import { z } from "zod";
import type { TKey } from "@/lib/typed-translations";

// ✅ Use TKey type with satisfies for type-safe translation keys
const loginFormSchema = z.object({
  nicknameOrEmail: z
    .string()
    .nonempty(
      "validation.pages.auth.login.nicknameOrEmail.required" satisfies TKey
    ),
  password: z
    .string()
    .nonempty("validation.pages.auth.login.password.required" satisfies TKey),
  rememberMe: z.boolean(),
});

// Advanced validation with custom refinement
const nicknameOrEmailSchema = z
  .string()
  .nonempty(
    "validation.pages.auth.login.nicknameOrEmail.required" satisfies TKey
  )
  .superRefine((value, ctx) => {
    if (value.includes("@")) {
      const result = emailSchema.safeParse(value);
      if (!result.success) {
        result.error.errors.forEach((err) => {
          ctx.addIssue({
            code: "custom",
            message: err.message,
            path: err.path,
          });
        });
      }
    } else {
      const result = nicknameSchema.safeParse(value);
      if (!result.success) {
        result.error.errors.forEach((err) => {
          ctx.addIssue({
            code: "custom",
            message: err.message,
            path: err.path,
          });
        });
      }
    }
  });
```

**Component usage with translation hook:**

```typescript
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";

function LoginPage() {
  const t = useTranslations("pages.Auth.LoginPage"); // For UI labels and placeholders
  const tValidation = useTranslationsWithFallback(); // For validation messages from schema

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      nicknameOrEmail: "",
      password: "",
      rememberMe: false,
    },
  });

  function onSubmit(data: LoginFormType) {
    // Handle form submission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Controller
          name="nicknameOrEmail"
          control={control}
          render={({ field }) => (
            <DefaultInput
              placeholder={t("form.nicknameOrEmailField.placeholder")}
              isInvalid={!!errors.nicknameOrEmail}
              errorMessage={tValidation(errors.nicknameOrEmail?.message)}
              onInputProps={{ ...field }}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <DefaultInput
              type="password"
              placeholder={t("form.passwordField.placeholder")}
              isInvalid={!!errors.password}
              errorMessage={tValidation(errors.password?.message)}
              onInputProps={{ ...field }}
            />
          )}
        />
      </Stack>
    </form>
  );
}
```

**Important:**

- **Use TKey type**: Import `TKey` from `@/lib/typed-translations` for all translation keys
- **Use satisfies operator**: Use `satisfies TKey` instead of `as ValidNamespaces` for better type checking
- **Error handling**: Use `useTranslationsWithFallback()` for validation error messages from schemas
- **Separate concerns**:
  - `useTranslations("namespace")` for UI labels and placeholders
  - `useTranslationsWithFallback()` for dynamic error messages from schemas
- **Type safety**: TypeScript will catch invalid translation keys at compile time

**Server Actions with TKey:**

```typescript
// In server actions, use TKey for type-safe error handling
import { returnValidationErrors } from "next-safe-action";
import type { TKey } from "@/lib/typed-translations";

export const register = action
  .inputSchema(registerFormSchema)
  .action(async ({ parsedInput: formData }) => {
    try {
      const user = await createNewUser(formData);
      await createSession(user._id.toString());
      redirect(ROUTES.dashboard);
    } catch (error) {
      if (error instanceof Error && error.message.includes("duplicate key")) {
        if (error.message.includes("email")) {
          returnValidationErrors(registerFormSchema, {
            _errors: ["api.auth.register.emailExists" satisfies TKey],
          });
        } else if (error.message.includes("nickname")) {
          returnValidationErrors(registerFormSchema, {
            _errors: ["api.auth.register.nicknameExists" satisfies TKey],
          });
        }
      }
      throw error;
    }
  });
```

## Authentication & Authorization

### Session Management

- JWT tokens stored in HTTP-only cookies
- Server-side session validation
- Automatic token refresh
- Secure logout with token cleanup

### Route Protection

```typescript
// Layout-based protection
export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUserId(); // Redirects if not authenticated, returns userId, you don't need to write this for every component because there are guards in layout.tsx, same existist for onboarding
  return <>{children}</>;
}
```

### Permission Patterns

- Role-based access through user data
- Route-level guards in layout components
- Component-level permission checks

## Database Patterns

### Connection Management

```typescript
// Always use the connection utility
import dbConnect from "@/util/connect-mongo";

export async function databaseOperation() {
  await dbConnect();
  // Database operations...
}
```

### Data Sanitization

```typescript
// Always sanitize data before returning to client in server actions
import { sanitizeUser } from "@/sanitizers/server-only/user-sanitize";

const user = await User.findById(id);
return sanitizeUser(user);
```

## Form Handling

### Multi-step Forms

- Context-based state management
- Page-level validation
- Navigation guards
- Progress tracking

### Validation Strategy

- Client-side validation with Zod
- Server-side validation for security
- Real-time validation feedback
- Internationalized error messages

## State Management

### Server State

- TanStack React Query for server state
- Automatic caching and invalidation
- Background refetching
- Optimistic updates

### Client State

- React Context for complex shared state
- useState for component-local state
- useReducer for complex state transitions

## Performance Optimization

### Code Splitting

- Dynamic imports for heavy components
- Route-based splitting (automatic)
- Component-level splitting where appropriate

Split only if you see that a component will be large and can have a loader.

Don't use React.lazy, use Next.js dynamic imports instead.

**Why use Next.js dynamic imports over React.lazy:**

- **Better SSR support**: Next.js dynamic imports work seamlessly with server-side rendering
- **Automatic code splitting**: Next.js automatically handles the bundling and loading
- **Built-in loading states**: Integrated with Next.js loading.tsx files
- **Better performance**: Optimized for Next.js build system
- **TypeScript support**: Better type inference and safety

**Usage examples:**

```typescript
// ❌ Don't use React.lazy
import { lazy, Suspense } from "react";
const HeavyComponent = lazy(() => import("./HeavyComponent"));

// ✅ Use Next.js dynamic imports
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>Loading component...</p>,
  ssr: false, // Optional: disable SSR for this component
});

// Usage in component
function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      <HeavyComponent />
    </div>
  );
}

// For components that should only load on client-side
const ClientOnlyComponent = dynamic(() => import("./ClientOnlyComponent"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
```

### Bundle Optimization

```javascript
// next.config.ts
experimental: {
  optimizePackageImports: [
    "@chakra-ui/react",
    "react-icons",
    "@tanstack/react-query",
    "react-hook-form",
  ],
}
```

### Image Optimization

- Use Next.js Image component
- Proper sizing and format selection
- Lazy loading by default

Don't use Image from Chakra UI, use Image from Next.js instead.

### Links Optimization

Don't use Link from Chakra UI or Link from Next.js directly. Use our custom ChakraLink component instead.

**ChakraLink Component Usage:**

The custom ChakraLink component is located at [`/src/components/chakra-config/ChakraLink.tsx`](../next-app/src/components/chakra-config/ChakraLink.tsx).

This component combines Next.js Link functionality with Chakra UI styling capabilities.

**Usage examples:**

```typescript
import ChakraLink from "@/components/chakra-config/ChakraLink";

<ChakraLink
  href="/profile"
  color="blue.500"
  fontWeight="bold"
  _hover={{ color: "blue.700" }}
  ...other props from Chakra
>
  Profile
</ChakraLink>
```

**Why use ChakraLink:**

- **Next.js optimization**: Includes all Next.js Link optimizations (prefetching, client-side routing)
- **Chakra UI styling**: Full access to Chakra UI's styling system and props
- **Type safety**: Proper TypeScript support for both Next.js and Chakra UI props
- **Consistent styling**: Maintains design system consistency across the application

**Using envConfigLoader.ts:**

The `envConfigLoader.ts` exports a `config` object that loads and validates environment variables with fallbacks:

```typescript
import { config } from "@/util/envConfigLoader";

// Usage in your code
const mongoUri = config.MONGODB_URI;
const sessionSecret = config.SESSION_SECRET;
const isSecure = config.SECURE_COOKIES;
```

If a variable is missing and has no fallback, the application will crash at startup with an appropriate message.

## React Query: Safe wrapper with error handling (DEMO)

Example usage of the useActionQuery wrapper with full error handling and built-in React Query features:

```tsx
import { login } from "@/services/auth/actions";
import { useActionQuery } from "./actions-querry";

export function DummyComponent() {
  const o = {
    nicknameOrEmail: "user@example.com",
    password: "password123",
    rememberMe: true,
  };

  const q = useActionQuery({
    queryKey: ["login", o.nicknameOrEmail],
    action: () => login(o), //pass action here
    onError: (error) => {
      //error has more complex structure
      if (error.serverError) {
        // Server error handling
        console.error("Server error:", error.serverError);
      }
      if (error.validationErrors) {
        // zod .format() method
        // Validation error handling
        console.warn("Validation errors:", error.validationErrors);
      }
      if (error.generalError) {
        // error
        // General error handling (e.g. network)
        console.error("General error:", error.generalError.message);
      }
    },
    retry: false, // Disable retries
  });

  return (
    <div>
      <div>Data: {JSON.stringify(q.data)}</div>
      <div>Error: {q.error ? q.error.message : "none"}</div>
      <div>
        ServerError:{" "}
        {q.error?.serverError ? String(q.error.serverError) : "none"}
      </div>
      <div>
        ValidationErrors:{" "}
        {q.error?.validationErrors
          ? JSON.stringify(q.error.validationErrors)
          : "none"}
      </div>
      <div>
        GeneralError:{" "}
        {q.error?.generalError ? String(q.error.generalError) : "none"}
      </div>
      <div>Loading: {q.isLoading ? "true" : "false"}</div>
      <div>Fetching: {q.isFetching ? "true" : "false"}</div>
      <div>Success: {q.isSuccess ? "true" : "false"}</div>
      <div>Error (isError): {q.isError ? "true" : "false"}</div>
      <div>Status: {q.status}</div>
      <div>Data updated at: {q.dataUpdatedAt}</div>
      <div>Error updated at: {q.errorUpdatedAt}</div>
      <button onClick={() => q.refetch()}>Refetch</button>
    </div>
  );
}
```
