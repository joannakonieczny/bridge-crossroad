## Coding Standards

## 📖 Language Versions

- **🇺🇸 English** - This version
- **🇵🇱 Polski** - [coding-standards.md](./pl/coding-standards.md)

### Route Management

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

### TypeScript Guidelines

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
import type { ValidNamespaces } from "@/lib/typed-translations";

// ✅ Use translation keys directly in schema definitions
const onboardingThirdPageSchema = z.object({
  cezarId: z
    .string()
    .transform(emptyStringToUndefined)
    .pipe(cezarIdSchema.optional()),
  bboId: z
    .string()
    .transform(emptyStringToUndefined)
    .pipe(bboIdSchema.optional()),
  cuebidsId: z
    .string()
    .transform(emptyStringToUndefined)
    .pipe(cuebidsIdSchema.optional()),
});

// Component usage with translation hook
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";

function ThirdPage() {
  const t = useTranslations("OnboardingPage.thirdPage"); // For labels, placeholders
  const tValidation = useTranslationsWithFallback(); // For validation messages from schema

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(onboardingThirdPageSchema),
    defaultValues: {
      cezarId: "",
      bboId: "",
      cuebidsId: "",
    },
  });

  function onSubmit(data: OnboardingThirdPageType) {
    // Handle form submission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Controller
          name="cezarId"
          control={control}
          render={({ field }) => (
            <DefaultInput
              placeholder={t("cezarId.placeholder")}
              isInvalid={!!errors.cezarId}
              errorMessage={tValidation(errors.cezarId?.message)}
              onInputProps={{ ...field }}
            />
          )}
        />

        <Controller
          name="bboId"
          control={control}
          render={({ field }) => (
            <DefaultInput
              placeholder={t("bboId.placeholder")}
              isInvalid={!!errors.bboId}
              errorMessage={tValidation(errors.bboId?.message)}
              onInputProps={{ ...field }}
            />
          )}
        />

        <Controller
          name="cuebidsId"
          control={control}
          render={({ field }) => (
            <DefaultInput
              placeholder={t("cuebidsId.placeholder")}
              isInvalid={!!errors.cuebidsId}
              errorMessage={tValidation(errors.cuebidsId?.message)}
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

- **No schema providers**: Use translation keys directly in schema definitions
- **Type safety**: Cast error messages to `ValidNamespaces` for type safety
- **Error handling**: Use `useTranslationsWithFallback()` for validation error messages
- **Separate concerns**:
  - `useTranslations("namespace")` for UI labels and placeholders
  - `useTranslationsWithFallback()` for dynamic error messages from schemas
- **Optional fields**: Use `.transform(emptyStringToUndefined).pipe(schema.optional())` pattern

**Real-world example from onboarding schema:**

```typescript
// Advanced validation with transformation and optional fields
const cezarIdSchema = z
  .string()
  .transform(emptyStringToUndefined)
  .pipe(
    z
      .string()
      .regex(
        /^\d{8}$/,
        "validation.model.user.onboarding.cezarId.regexLenght" as ValidNamespaces
      )
      .optional()
  );

// Transform empty strings to undefined for optional fields
const emptyStringToUndefined = (value: string | undefined) =>
  value === "" ? undefined : value;

// Complete schema with multiple optional fields
const onboardingThirdPageSchema = z.object({
  cezarId: z
    .string()
    .transform(emptyStringToUndefined)
    .pipe(cezarIdSchema.optional()),
  bboId: z
    .string()
    .transform(emptyStringToUndefined)
    .pipe(bboIdSchema.optional()),
  cuebidsId: z
    .string()
    .transform(emptyStringToUndefined)
    .pipe(cuebidsIdSchema.optional()),
});
```

````

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
````

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

## Localization Guidelines

### Typed Translation System

The application uses a custom wrapper over next-intl (`src/lib/typed-translations.ts`) that provides full type safety and namespace validation:

**Basic usage:**

```typescript
import { useTranslations, getTranslations } from "@/lib/typed-translations";

// ✅ Client components - automatic autocomplete
const t = useTranslations();
t("common.appName"); // TypeScript checks key validity

// ✅ Server components
const t = await getTranslations();
const message = t("Auth.LoginPage.title");
```

**Safe namespace with validation:**

```typescript
// ✅ Correct usage - namespace exists
const authT = useTranslations("Auth");
authT("LoginPage.title"); // Autocomplete for Auth.* keys

// ❌ Compilation error - invalid namespace
const invalidT = useTranslations("NonExistent"); // TypeScript error!
```

**TranslationKeys type for namespace validation:**

```typescript
// Checks namespace validity at compile time
type ValidKeys = TranslationKeys<"Auth">; // ✅ Returns keys from Auth
type InvalidKeys = TranslationKeys<"BadNamespace">; // ❌ never type

// Usage in helper functions
function getAuthMessage<T extends string>(
  namespace: T,
  key: TranslationKeys<T>
): string {
  const t = useTranslations(namespace);
  return t(key);
}

// ✅ Works correctly
getAuthMessage("Auth", "LoginPage.title");

// ❌ Compilation error
getAuthMessage("Invalid", "some.key");
```

**Benefits of typed translation system:**

- **Autocomplete**: Full IDE support for translation keys
- **Namespace validation**: TypeScript detects invalid namespaces
- **Refactoring safety**: Key changes automatically detect errors
- **Value interpolation**: Type-safe variable insertion into texts
- **Rich content support**: Safe usage of React components in translations

### Translations

- All user interface text in messages/pl.ts
- Translation keys in camelCase
- Grouping by functionality
- Placeholder values for dynamic content
- **Always use typed-translations instead of next-intl directly**

**Translation structure example:**

```typescript
// messages/pl.ts
export default {
  common: {
    appName: "Bridge Crossroad",
    buttons: {
      save: "Save",
      cancel: "Cancel",
    },
  },
  Auth: {
    LoginPage: {
      title: "Login",
      emailPlaceholder: "Enter email",
    },
  },
} as const; // Important: as const for type inference
```
