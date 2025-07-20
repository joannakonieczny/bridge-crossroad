## Coding Standards

## 📖 Language Versions

- **🇺🇸 English** - This version
- **🇵🇱 Polski** - [coding-standards.md](./pl/coding-standards.md)

### TypeScript Guidelines

- Enable strict mode
- Use proper type annotations
- Prefer interfaces over types for object shapes
- Use utility types when appropriate
- Avoid `any` - use `unknown` for truly unknown data

### Component Patterns

```typescript
// Component structure example
"use client"; // Only when client-side features needed

import { ComponentProps } from "react"; // don't use import * as React - extremely non-optimal

interface ComponentNameProps { // same name as component + Props
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
import { schemaProvider } from "@/schemas/...";

export const actionName = action
  .inputSchema(schemaProvider.schema) // parsing and automatic rejection when validation fails
  .action(async ({ parsedInput: myInputtedData }) => {
    // Business logic
    console.log(myInputtedData); // executes on the backend side
    return result;
  });
```

### Form Validation Pattern

```typescript
// Schema definition
export function FormSchemaProvider() {
  const t = useTranslations("form");

  const schema = z.object({
    field: z.string().nonempty(t("field.required")),
  });

  return { schema };
}

// Component usage
const { schema } = FormSchemaProvider();
const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
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
