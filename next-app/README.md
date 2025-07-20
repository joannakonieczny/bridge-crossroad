# Bridge CrossRoad - Next.js Application

Technical documentation for the Next.js 15 web application component of the Bridge CrossRoad platform.

## 📖 Language Versions

- **🇺🇸 English** - This version
- **🇵🇱 Polski** - [README-nextapp.md](../docs/pl/README-nextapp.md)

## Architecture

This application follows Next.js App Router architecture with clear separation of concerns:

- **Components Layer**: Reusable UI components with Chakra UI
- **Services Layer**: Server Actions for business logic
- **Repositories Layer**: Data access abstraction
- **Models Layer**: MongoDB/Mongoose schemas

## Tech Stack

### Core Framework

- **Next.js 15**: App Router, Server Components, Server Actions
- **TypeScript**: Strict mode with full type safety
- **React 18**: Latest features with Suspense and Concurrent Rendering

### Authentication & Security

- **JWT**: Custom implementation with `jose` library
- **bcryptjs**: Password hashing with salt rounds
- **next-safe-action**: Type-safe server actions with validation
- **Zod**: Runtime schema validation

### Database & State

- **MongoDB**: Document database with connection pooling
- **Mongoose**: ODM with TypeScript support and middleware
- **TanStack React Query**: Server state management with caching

### UI & Styling

- **Chakra UI v2**: Component library with custom theme
- **Emotion**: CSS-in-JS with theme integration
- **next/font**: Optimized Montserrat font loading
- **Responsive Design**: Mobile-first approach

### Internationalization

- **next-intl**: Server-side translations with Polish support
- **Type-safe translations**: Full TypeScript integration

## Development Setup

### Prerequisites

- Node.js 18+ (tested with 18.17.0)
- MongoDB 6.0+ (local or Atlas)
- npm or pnpm package manager

### Environment Configuration

Required environment variables:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/bridge-crossroad
MONGODB_DB_NAME=bridge-crossroad

# Authentication
SESSION_SECRET=your-secret-key-here
EXPIRATION_TIME=3600
SECURE_COOKIES=false
```

### Installation & Startup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

Application will be available at [http://localhost:3000](http://localhost:3000)

## Build & Deployment

### Development Build

```bash
npm run dev          # Development server with hot reload
npm run type-check   # TypeScript compilation check
npm run lint         # ESLint checking
```

### Production Build

```bash
npm run build        # Optimized production build
npm start           # Start production server
npm run analyze     # Bundle size analysis
```

## Architecture Patterns

### Server Actions Pattern

All data mutations use Next.js Server Actions with `next-safe-action`:

```typescript
export const createUser = action
  .inputSchema(userSchema)
  .action(async ({ parsedInput }) => {
    // Type-safe server-side logic
  });
```

### Repository Pattern

Data access is abstracted through repository classes:

```typescript
export class UserRepository {
  static async findByEmail(email: string) {
    await dbConnect();
    return await User.findOne({ email }).toObject();
  }
}
```

### Form Validation

Client and server validation with Zod schemas:

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

## Development Guidelines

### Component Structure

- Server Components by default
- Client Components only when needed (`'use client'`)
- Default exports for pages and layouts
- Props interfaces with component name + `Props` suffix

### State Management

- TanStack React Query for server state
- React Context for complex client state
- Local `useState` for component state

### Styling Conventions

- Chakra UI components with custom theme
- Custom ChakraLink component for navigation
- Responsive design with Chakra breakpoints
- Custom color palette and typography scale

## Security Implementation

### Authentication Flow

- JWT tokens stored in HTTP-only cookies
- Server-side session validation on protected routes
- Automatic token refresh and secure logout
- Password hashing with bcryptjs (12 salt rounds)

### Data Protection

- Input validation with Zod schemas
- SQL injection prevention with Mongoose ODM
- XSS protection with Next.js built-in sanitization
- CSRF protection through SameSite cookies

## Performance Optimizations

### Bundle Optimization

- Dynamic imports for code splitting
- Optimized package imports for Chakra UI, React Icons
- Next.js Image component for optimized images
- Font optimization with next/font

### Database Performance

- MongoDB connection pooling
- Indexed queries for user lookups
- Aggregation pipelines for complex queries
- Data sanitization before client transmission

## Testing Strategy

### Component Testing

```bash
npm run test          # Jest + React Testing Library
npm run test:watch    # Watch mode for development
```

### Type Safety

```bash
npm run type-check    # TypeScript compilation
npm run lint          # ESLint with TypeScript rules
```

## Documentation

- **Architecture Guide**: [🇺🇸 `../docs/architecture.md`](../docs/architecture.md) | [🇵🇱 `../docs/pl/architecture.md`](../docs/pl/architecture.md)
- **Coding Standards**: [🇺🇸 `../docs/coding-standards.md`](../docs/coding-standards.md) | [🇵🇱 `../docs/pl/coding-standards.md`](../docs/pl/coding-standards.md)
- **API Documentation**: Generated from TypeScript interfaces
- **Component Documentation**: Storybook integration planned

## Contributing

### Development Workflow

1. Create feature branch from `main`
2. Follow coding standards and architecture patterns
3. Add TypeScript types and validation schemas
4. Include Polish translations for new text
5. Test error cases and edge conditions
6. Submit pull request with comprehensive description

### Code Quality Standards

- ESLint configuration with TypeScript rules
- Prettier integration for consistent formatting
- GitHub Actions for CI/CD pipeline

---

**Engineering Thesis Project** by Szymon Kubiczek, Bartłomiej Szubiak, and Joanna Konieczny

For project overview and general information, see the [main README](../README.md).
