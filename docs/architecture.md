# Development Guide - Bridge Crossroad

This document outlines the development practices, architecture, and coding standards for the Bridge Crossroad project.

## 📖 Language Versions

- **🇺🇸 English** - This version
- **🇵🇱 Polski** - [architecture.md](./pl/architecture.md)

## Architecture Overview

The application follows a modern Next.js architecture with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│                 Client                  │
├─────────────────────────────────────────┤
│            Components Layer             │
├─────────────────────────────────────────┤
│            Services Layer               │
│         (Server Actions)                │
├─────────────────────────────────────────┤
│           Repositories Layer            │
│         (Data Access)                   │
├─────────────────────────────────────────┤
│             Models Layer                │
│         (MongoDB/Mongoose)              │
└─────────────────────────────────────────┘
```

## Next.js Tutorial

The client refers to the browser.

- UI component and page exports (page.tsx, layout.tsx...) must be default exports
- Component types: server-side, client-side ('use client') - server-side is default

**Component Types Explained:**

- **Server Components** (default): Rendered on the server, cannot use browser-specific APIs, hooks, or event handlers
- **Client Components** ('use client'): Rendered in the browser, can use hooks, event handlers, and browser APIs
- **Server-only** ('server-only'): Code that runs exclusively on the server (backend)
- **Server Actions** ('use server'): Functions declared on the server but can be called by the client as endpoints

**Server Actions**

Functions that execute on the server but can be invoked from the client as API endpoints. They provide a seamless way to handle form submissions and server-side logic without creating separate API routes.

## Directory Structure

### `/src/app` - Next.js App Router

URLs are built from folder structure. Folders can contain:

- **layout.tsx** - Page layout component
- **page.tsx** - The actual page component
- **loading.tsx** - Loading UI component shown during navigation
- **error.tsx** - Error UI component for handling errors
- **not-found.tsx** - 404 page component
- **global-error.tsx** - Global error handling component
- **route.ts** - API route handlers (GET, POST, etc.)
- **middleware.ts** - Request/response middleware
- **template.tsx** - Similar to layout but re-renders on navigation
- **default.tsx** - Fallback component for parallel routes

- Route-based file structure
- Server-side rendering and routing
- Layout components for shared UI
- Route groups for logical organization:
  - `(logged)` - Protected routes requiring authentication
  - `(with-onboarding)` - Routes requiring completed onboarding
  - `auth` - Authentication pages

### `/src/components` - UI Components

Must match folder structure from `/src/app` folder, for example:

```
components/
├── auth/                   # Authentication forms
├── onboarding/            # Multi-step onboarding
```

**Component Guidelines:**

- Use ChakraUI for styling
- Remember we have our own custom color palette
- Name components appropriately and descriptively

### `/src/services` - Business Logic

Server Actions (aka endpoints) implementing business logic:

- **Grouping folder** (e.g., auth) - named the same as the corresponding page
- **actions.ts** - endpoint code
- **server-only** - functionality code for endpoints that should execute only on the server side, file must start with 'server-only'

Example:

```
services/
├── auth/
│   ├── actions.ts         # Login, register, logout
│   └── server-only/       # Session management (server-only functions)
├── onboarding/
│   └── actions.ts         # Onboarding completion
└── action-lib.ts          # Collective configuration for endpoint logic
```

**Service Guidelines:**

- Use `"use server"` directive for server actions
- Validate input with Zod schemas
- Handle errors gracefully with meaningful messages
- Use `next-safe-action`

**Example without next-safe-action:** ❌

```typescript
"use server";

export async function loginUser(formData: LoginData) {
  // Manual validation
  if (!formData.email || !formData.password) {
    throw new Error("Missing required fields"); // useless and dangerous - error.message is not visible to client
  }

  // Manual error handling
  try {
    const user = await findUser(formData);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    return { success: true, user };
  } catch (error) {
    throw new Error("Login failed");
  }
}
```

**Example with next-safe-action:** ✅

```typescript
"use server";
import { action } from "@/services/action-lib";
import { loginSchema } from "@/schemas/auth";

export const loginUser = action
  .inputSchema(loginSchema) // if validation fails, it will be visible to the client under validation error
  .action(async ({ parsedInput: formData }) => {
    // Automatic validation and error handling
    const user = await findUser(formData);
    if (!user) {
      return null;
      // or
      returnValidationErrors(schema, {
        // adds your error under specific Zod validation field
        _errors: ["emailExists"],
      });
      // or use other next-safe-action methods
      // ❌ return {success: true} - we already have a protocol for this in next-safe-action
    }
    return sanitizeUser(user);
  });
```

**Execution of such an action returns:**

When you call a next-safe-action server action, it returns a result object with the following structure:

```typescript
// Success case
{
  data: YourReturnType,           // The data you returned from .action()
  serverError: null,
  validationErrors: null,
  bindArgsValidationErrors: []
}

// Validation error case
{
  data: null,
  serverError: null,
  validationErrors: {
    fieldName: ["Error message"],
    _errors: ["General error message"]
  },
  bindArgsValidationErrors: []
}

// Server error case
{
  data: null,
  serverError: "Error message from handleServerError",
  validationErrors: null,
  bindArgsValidationErrors: []
}
```

**Why use next-safe-action:**

- **Automatic input validation**: Zod schemas are automatically applied
- **Type safety**: Input and output types are inferred from schemas
- **Error handling**: Consistent error handling across all actions
- **Client-side integration**: Easy integration with React hooks
- **Validation errors**: Automatic form field validation error display
- **Performance**: Built-in optimistic updates and loading states

### `/src/repositories` - Data Access Layer

Database operations abstracted from business logic:

- We operate on DTO objects
- Return processed (not sanitized) data or null
- Error throwing logic should not be at this application level
- Create transactions when needed

Example:

```
repositories/
├── user-auth.ts           # User authentication operations
└── onboarding.ts          # Onboarding data operations
```

**Repository Guidelines:**

- Use `"server-only"` directive
- Always connect to database before operations
- Return pre-serialized objects (use `.toObject()`) - they still contain things like database fetch timestamps, but no longer dangerous low-level methods (from prototype)
- Handle database errors appropriately
- Abstract database-specific logic

### `/src/models` - Data Models

MongoDB schemas using Mongoose:

These are schemas for DTO objects only.

- Remember to write appropriate interfaces that correspond to Mongoose models
- Use Types.ObjectId for object IDs
- Remember that every object has `_id`, even nested ones (although you don't have to declare them if you don't need them)

```typescript
// Prevent re-registering the model (issue with hot reload in Next.js)
export default models.User || model<IUserDTO>("User", UserSchema);
```

Example:

```
models/
└── user.ts               # User model with validation
```

**Model Guidelines:**

- Define TypeScript interfaces
- Include comprehensive validation - these are only at the database level!
- Use Mongoose middleware for business rules
- Implement proper indexing for performance

### `/src/schemas` - Validation Schemas

Zod schemas for runtime validation:

```
schemas/
├── common.ts              # Shared validation utilities
├── model/                 # Related to database objects, but not DTOs
│   └── user/
│       ├── user-schema.ts      # Schema and constants used throughout the application for both client and backend
│       └── user-types.ts       # Types inferred from schema
├── pages/                 # Related to pages - e.g., form field validation for backend or client
│   ├── auth/
│   └── onboarding/
│       ├── onboarding-schema.ts # All onboarding schemas and validation constants
│       └── onboarding-types.ts  # All onboarding types inferred from schemas
```

### `/src/i18n` - Internationalization

Translation system configuration with full type safety.

Translations are located in `/messages/pl.ts`

Translations are an object where each value must be a string.

**⚠️ Important: Always use the `typed-translations` wrapper instead of next-intl directly**

**Usage Example with typed-translations:**

```typescript
import { useTranslations, getTranslations } from "@/lib/typed-translations";

function MyComponent() {
  const t = useTranslations("common.buttons"); // ✅ Type-safe namespace
  return <button>{t("save")}</button>; // ✅ Autocomplete works
}

// Server component example
async function ServerComponent() {
  const t = await getTranslations("validation.user");
  return <div>{t("emailRequired")}</div>; // ✅ Type-safe
}
```

**Benefits of typed-translations wrapper:**

- **Namespace validation**: TypeScript detects invalid namespaces at compile time
- **Autocomplete**: Full IDE support for all translation keys
- **Refactoring safety**: Key changes automatically detect errors
- **TranslationKeys<T> type**: Helper type for namespace validation in functions

**Translation File Structure:**

```typescript
// /messages/pl.ts
export default {
  common: {
    appName: "Bridge Crossroad",
    buttons: {
      save: "Zapisz",
      cancel: "Anuluj",
    },
  },
  Auth: {
    LoginPage: {
      title: "Logowanie",
      emailPlaceholder: "Wprowadź email",
    },
  },
} as const; // ⚠️ Important: as const for type inference
```

```
i18n/
├── config.ts              # Locale configuration
└── request.ts             # Request-based locale handling
```

### more about it:

https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
https://next-intl.dev/docs/usage/messages

### `/src/routes.ts` - Route Constants

Centralized route definitions for type-safe navigation:

**Usage Guidelines:**

- Always import and use `ROUTES` instead of hardcoded strings
- Update this file when adding new routes
- Use TypeScript's type inference for route validation

### `/src/util` - Utilities

Shared utility functions:

Example:

```
util/
├── connect-mongo.ts       # Database connection
├── date.ts                # Date utilities - month names (translated)
└── envConfigLoader.ts     # Environment variables loader
```

**Using envConfigLoader.ts:**

The `envConfigLoader.ts` exports a `config` object that loads and validates environment variables with fallbacks:

```typescript
import { config } from "@/util/envConfigLoader";

// Usage in your code
const mongoUri = config.MONGODB_URI;
const sessionSecret = config.SESSION_SECRET;
const isSecure = config.SECURE_COOKIES;
```

**Available Environment Variables:**

- `SESSION_SECRET` - Secret key for session encryption (fallback: "123")
- `EXPIRATION_TIME` - Session expiration time in seconds (fallback: "3600")
- `SECURE_COOKIES` - Whether to use secure cookies (fallback: "false")
- `MONGODB_URI` - MongoDB connection string (required, no fallback)
- `MONGODB_DB_NAME` - MongoDB database name (required, no fallback)

If a variable is missing and has no fallback, the application will crash at startup with an appropriate message.

## Testing Guidelines

### Component Testing

- Test user interactions
- Test error states
- Mock external dependencies
- Test accessibility

### Integration Testing

- Test complete user flows
- Test API endpoints
- Test database operations
- Test authentication flows

## Error Handling

### Client-side Errors

```typescript
// Component error boundaries
// Form validation errors
// Network error handling
```

### Server-side Errors

```typescript
// Validation errors with next-safe-action
// Database errors
// Authentication errors
// Business logic errors
```

## Development Workflow

### Setup

1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`

### Code Quality

- ESLint for code linting
- TypeScript for type checking
- Prettier for code formatting (if configured)

### Git Workflow

- Feature branches for new development
- Meaningful commit messages
- Pull request reviews
- Automated testing on CI/CD

## Environment Configuration

You can check which variables are loaded in [envConfigLoader](../next-app/src/util/envConfigLoader.ts).
Additionally, they are described in [.env.example](../next-app/.env.example).

If any variable is missing, a fallback will be used and you'll receive a warning message.
If a variable is critical (must be provided), the application will crash at startup with an appropriate message.

### Development vs Production

- Different database connections
- Debug modes
- Analytics integration
- Error reporting services

## Deployment

### Build Process

```bash
npm run build    # Production build
npm run analyze  # Bundle analysis
npm start        # Production server
```

### Performance Monitoring

- Bundle size analysis
- Core Web Vitals monitoring
- Database query performance
- Error tracking

---

## Contributing

When adding new features:

1. Follow the established architecture patterns
2. Add proper TypeScript types
3. Include validation schemas
4. Add internationalization support
5. Test error cases
6. Update documentation
