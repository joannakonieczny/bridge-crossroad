# Standardy Kodowania

## 📖 Wersje Językowe

- **🇺🇸 English** – [coding-standards.md](../coding-standards.md)
- **🇵🇱 Polski** – Ta wersja

## Zarządzanie Trasami

**Zawsze używaj scentralizowanego pliku tras:**

```typescript
// ❌ Nie używaj hardkodowanych stringów
<ChakraLink href="/auth/login">Logowanie</ChakraLink>;
redirect("/dashboard");

// ✅ Używaj stałej ROUTES
import { ROUTES } from "@/routes";

<ChakraLink href={ROUTES.auth.login}>Logowanie</ChakraLink>;
redirect(ROUTES.dashboard);
```

**Korzyści z używania ROUTES:**

- **Bezpieczeństwo typów**: Zapobiega literówkom w stringach tras
- **Refaktoryzacja**: Łatwe aktualizowanie tras w całej aplikacji
- **Wsparcie IDE**: Autouzupełnianie i IntelliSense dla ścieżek tras
- **Spójność**: Pojedyncze źródło prawdy dla całej nawigacji
- **Dokumentacja**: Przejrzysty przegląd wszystkich dostępnych tras

**Dodając nowe trasy:**

1. Dodaj trasę do obiektu `ROUTES` w `/src/routes.ts`
2. Użyj opisowej zagnieżdżonej struktury dla powiązanych tras
3. Zawsze dodaj asercję `as const` dla wnioskowania typów
4. Zaktualizuj typ `RouteKeys` jeśli to konieczne

## Wytyczne TypeScript

- Włącz tryb strict
- Używaj odpowiednich adnotacji typów
- **Preferuj types nad interfaces** – używaj `type` dla wszystkich kształtów obiektów i props komponentów
- Używaj utility types gdy to odpowiednie
- Unikaj `any` – używaj `unknown` dla naprawdę nieznanych danych lub `never`
- Używaj PropsWithChildren z React jeśli musisz przekazać children do komponentu lub zadeklarować typ propsów komponentu

**Dlaczego preferować types nad interfaces:**

```typescript
// ✅ Preferowane: Używaj type dla props komponentów
type ButtonProps = {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

// ✅ Preferowane: Używaj type dla kształtów obiektów
type User = {
  id: string;
  name: string;
  email: string;
};

// ❌ Unikaj: Używania interface dla prostych kształtów obiektów
interface ButtonProps {
  text: string;
  onClick?: () => void;
}

// ✅ Przykład: Użycie PropsWithChildren dla komponentów przyjmujących children
import type { PropsWithChildren } from "react";

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
      <button onClick={onClose}>Zamknij</button>
      <div>{children}</div>
    </div>
  );
}
```

## Lokalizacja i tłumaczenia

### System typowanych tłumaczeń

Aplikacja używa niestandardowej nakładki na next-intl (`src/lib/typed-translations.ts`), która zapewnia pełne bezpieczeństwo typów i walidację namespace. **Zawsze używaj eksportowanych typów `TKey` i `ITranslationKey` dla typowanej obsługi tłumaczeń.**

**Podstawowe użycie:**

```typescript
import { useTranslations, getTranslations } from "@/lib/typed-translations";
import type { TKey } from "@/lib/typed-translations";

// ✅ Komponenty klienckie – automatyczne podpowiedzi
const t = useTranslations();
t("common.appName"); // TypeScript sprawdza poprawność klucza

// ✅ Komponenty serwerowe
const t = await getTranslations();
const message = t("pages.Auth.LoginPage.title");

// ✅ Typowane klucze tłumaczeń w schematach
const errorKey: string =
  "validation.pages.auth.login.password.required" satisfies TKey;
```

**Dostępne typy kluczy:**

- **`TKey`** – Wszystkie dostępne klucze tłumaczeń jako ścieżki z kropkami (alias dla `AllTranslationKeys`)
- **`ITranslationKey<T>`** – Klucze tłumaczeń ograniczone do namespace `T`
- **`ValidNamespaces`** – Wszystkie poprawne ścieżki namespace (używane wewnętrznie)

**Używanie TKey z operatorem satisfies:**

```typescript
import type { TKey } from "@/lib/typed-translations";

// ✅ Nowoczesne podejście – używaj satisfies dla lepszego sprawdzania typów
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

// ❌ Przestarzałe podejście – unikaj używania as ValidNamespaces
const oldWay = "some.key" as ValidNamespaces; // Mniejsze bezpieczeństwo typów
```

**Bezpieczne namespace z walidacją:**

```typescript
// ✅ Poprawne użycie – namespace istnieje
const authT = useTranslations("pages.Auth");
authT("LoginPage.title"); // Podpowiedzi dla pages.Auth.*

// ✅ Głębokie namespace
const loginT = useTranslations("pages.Auth.LoginPage");
loginT("title"); // Bezpośredni dostęp do title

// ❌ Błąd kompilacji – nieprawidłowy namespace
const invalidT = useTranslations("NonExistent"); // Błąd TypeScript!
```

**Server Actions z TKey:**

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
    // ... reszta logiki
  });
```

**Korzyści nowego podejścia z TKey:**

- **Lepsze wnioskowanie typów**: `satisfies` zachowuje typ literału podczas sprawdzania poprawności
- **Walidacja w czasie kompilacji**: Nieprawidłowe klucze są wykrywane podczas kompilacji TypeScript
- **Wsparcie IntelliSense**: Pełne podpowiedzi dla wszystkich dostępnych kluczy tłumaczeń
- **Bezpieczeństwo refaktoryzacji**: Zmiana nazwy kluczy automatycznie aktualizuje wszystkie odwołania
- **Brak narzutu runtime**: Sprawdzanie typów tylko w czasie kompilacji

**Migracja ze starego podejścia:**

```typescript
// ❌ Stary sposób – używanie ValidNamespaces z asercją as
"some.key" as ValidNamespaces;

// ✅ Nowy sposób – używanie TKey z satisfies
"some.key" satisfies TKey;
```

### Struktura tłumaczeń

#### Główne namespace tłumaczeń

- **common** – ogólne teksty, nazwy aplikacji, enumy, globalne komunikaty (np. miesiące, academy, trainingGroup)
- **validation** – komunikaty walidacyjne używane w schematach Zod (np. validation.pages.auth.login)
- **api** – komunikaty zwracane przez server actions (np. api.auth.register.emailExists)
- **pages** – teksty specyficzne dla stron (placeholdery, nagłówki, opisy itd.)
- **components** – teksty używane przez współdzielone komponenty

#### Zasady dla `validation` i `api`

- Wszystkie klucze tłumaczeń muszą być zadeklarowane z `satisfies TKey` dla bezpieczeństwa typów.
- W komponentach React zawsze używaj `useTranslationsWithFallback()` do pobierania tych tekstów.
- Tłumaczenia muszą być prostymi stringami – nie używaj obiektów ani interpolacji (np. `{name}`), tylko zwykłe stringi.
- Zmienne powinny być ładowane z globalnej konfiguracji, a nie przekazywane przez klucze tłumaczeń.

#### Zasady dla `pages`

- Pełna elastyczność – teksty mogą być zagnieżdżone, złożone, zawierać placeholdery, opisy, nagłówki itd.
- Tylko dla tekstów widocznych na stronie (UI/UX copy).

#### Struktura zagnieżdżania

- Zagnieżdżaj tłumaczenia zgodnie z logiką domenową (np. `pages.Auth.LoginPage`, `pages.OnboardingPage`).
- Grupuj teksty według funkcjonalności lub komponentu.
- Przykład:
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

#### Enumy w `common`

- Enumy (np. academies, training groups) powinny być zadeklarowane w plikach konfiguracyjnych (np. `Academy`, `TrainingGroup`), a ich tłumaczenia w `common`:
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
- Zawsze importuj enumy i używaj ich jako kluczy tłumaczeń dla spójności i bezpieczeństwa typów.

#### Struktura enumów

klucz taki sam jak wartość

```js
export enum Academy {
	UJ = "UJ",
	AGH = "AGH",
	PK = "PK",
	// ...
}
```

### Dobre praktyki

- Unikaj duplikowania kluczy na tym samym poziomie.
- Zawsze grupuj tłumaczenia logicznie i według przeznaczenia.
- Dla złożonych komponentów lub stron używaj dodatkowych poziomów zagnieżdżenia.
- **Zawsze używaj typed-translations zamiast next-intl bezpośrednio**

### Wzorce komponentów

```typescript
// Przykład struktury komponentu
"use client"; // Tylko gdy potrzebne są funkcje po stronie klienta

import { ComponentProps } from "react"; // nie używaj import * as React – bardzo nieoptymalne

type ComponentNameProps = { // ta sama nazwa co komponent + Props
	required: string;
	optional?: boolean;
	onAction?: () => void;
}

export default function ComponentName({ // export default function, nie arrow function
	required,
	optional = false,
	onAction
}: ComponentNameProps) {
	// Logika komponentu
	return (
		// JSX
	);
}
```

### Wzorzec Server Action

```typescript
"use server";

import { action } from "@/services/action-lib";
import { userSchema } from "@/schemas/model/user/user-schema";
// lub dla schematów onboarding:
// import { onboardingFirstPageSchema } from "@/schemas/pages/onboarding/onboarding-schema";

export const actionName = action
  .inputSchema(userSchema) // parsowanie i automatyczne odrzucenie przy niepowodzeniu walidacji
  .action(async ({ parsedInput: myInputtedData }) => {
    // Logika biznesowa
    console.log(myInputtedData); // wykonuje się po stronie backendu
    return result;
  });
```

### Wzorzec walidacji formularzy

```typescript
// Definicja schematu z typowanymi kluczami tłumaczeń
import { z } from "zod";
import type { TKey } from "@/lib/typed-translations";

// ✅ Używaj typu TKey z satisfies dla typowanych kluczy tłumaczeń
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

// Zaawansowana walidacja z niestandardowym refinement
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

**Użycie w komponencie z hookiem tłumaczeń:**

```typescript
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";

function LoginPage() {
  const t = useTranslations("pages.Auth.LoginPage"); // Dla etykiet UI i placeholderów
  const tValidation = useTranslationsWithFallback(); // Dla komunikatów walidacji ze schematu

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
    // Obsługa wysłania formularza
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

**Ważne:**

- **Używaj typu TKey**: Importuj `TKey` z `@/lib/typed-translations` dla wszystkich kluczy tłumaczeń
- **Używaj operatora satisfies**: Używaj `satisfies TKey` zamiast `as ValidNamespaces` dla lepszego sprawdzania typów
- **Obsługa błędów**: Używaj `useTranslationsWithFallback()` dla komunikatów błędów walidacji ze schematów
- **Rozdziel obowiązki**:
  - `useTranslations("namespace")` dla etykiet UI i placeholderów
  - `useTranslationsWithFallback()` dla dynamicznych komunikatów błędów ze schematów
- **Bezpieczeństwo typów**: TypeScript wykryje nieprawidłowe klucze tłumaczeń w czasie kompilacji

**Server Actions z TKey:**

```typescript
// W server actions używaj TKey dla typowanej obsługi błędów
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

## Uwierzytelnienie i autoryzacja

### Zarządzanie sesjami

- Tokeny JWT przechowywane w HTTP-only cookies
- Walidacja sesji po stronie serwera
- Automatyczne odświeżanie tokenów
- Bezpieczne wylogowanie z czyszczeniem tokenów

### Ochrona tras

```typescript
// Ochrona oparta na layout
export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUserId(); // Przekierowuje jeśli nie uwierzytelniony, zwraca userId, nie musisz pisać tego dla każdego komponentu bo są guardy w layout.tsx, to samo istnieje dla onboardingu
  return <>{children}</>;
}
```

### Wzorce uprawnień

- Dostęp oparty na rolach przez dane użytkownika
- Guardy na poziomie tras w komponentach layout
- Sprawdzanie uprawnień na poziomie komponentów

## Wzorce bazy danych

### Zarządzanie połączeniami

```typescript
// Zawsze używaj narzędzia połączenia
import dbConnect from "@/util/connect-mongo";

export async function databaseOperation() {
  await dbConnect();
  // Operacje bazodanowe...
}
```

### Sanityzacja danych

```typescript
// Zawsze sanityzuj dane przed zwróceniem do klienta w server actions
import { sanitizeUser } from "@/sanitizers/server-only/user-sanitize";

const user = await User.findById(id);
return sanitizeUser(user);
```

## Obsługa formularzy

### Formularze wieloetapowe

- Zarządzanie stanem oparte na kontekście
- Walidacja na poziomie strony
- Guardy nawigacji
- Śledzenie postępu

### Strategia walidacji

- Walidacja po stronie klienta z Zod
- Walidacja po stronie serwera dla bezpieczeństwa
- Informacje zwrotne o walidacji w czasie rzeczywistym
- Zinternacjonalizowane komunikaty błędów

## Zarządzanie stanem

### Stan serwera

- TanStack React Query dla stanu serwera
- Automatyczne cachowanie i unieważnianie
- Odświeżanie w tle
- Optymistyczne aktualizacje

### Stan klienta

- React Context dla złożonego wspólnego stanu
- useState dla stanu lokalnego komponentu
- useReducer dla złożonych przejść stanu

## Optymalizacja wydajności

### Dzielenie kodu

- Dynamiczne importy dla ciężkich komponentów
- Dzielenie na poziomie tras (automatyczne)
- Dzielenie na poziomie komponentów, gdy to uzasadnione

Dziel tylko jeśli komponent jest duży i może mieć loader.

Nie używaj React.lazy, używaj dynamicznych importów Next.js.

**Dlaczego dynamiczne importy Next.js zamiast React.lazy:**

- **Lepsze wsparcie SSR**: Dynamiczne importy Next.js działają z renderowaniem po stronie serwera
- **Automatyczne dzielenie kodu**: Next.js automatycznie obsługuje bundlowanie i ładowanie
- **Wbudowane stany ładowania**: Zintegrowane z plikami loading.tsx
- **Lepsza wydajność**: Zoptymalizowane pod system budowania Next.js
- **Wsparcie TypeScript**: Lepsze wnioskowanie typów i bezpieczeństwo

**Przykłady użycia:**

```typescript
// ❌ Nie używaj React.lazy
import { lazy, Suspense } from "react";
const HeavyComponent = lazy(() => import("./HeavyComponent"));

// ✅ Używaj dynamicznych importów Next.js
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>Ładowanie komponentu...</p>,
  ssr: false, // Opcjonalnie: wyłącz SSR dla tego komponentu
});

// Użycie w komponencie
function MyPage() {
  return (
    <div>
      <h1>Moja Strona</h1>
      <HeavyComponent />
    </div>
  );
}

// Dla komponentów tylko po stronie klienta
const ClientOnlyComponent = dynamic(() => import("./ClientOnlyComponent"), {
  ssr: false,
  loading: () => <div>Ładowanie...</div>,
});
```

### Optymalizacja bundla

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

### Optymalizacja obrazów

- Używaj komponentu Image z Next.js
- Odpowiednie rozmiary i formaty
- Lazy loading domyślnie

Nie używaj Image z Chakra UI, tylko z Next.js.

### Optymalizacja linków

Nie używaj Link z Chakra UI ani Link z Next.js bezpośrednio. Używaj własnego komponentu ChakraLink.

**Użycie ChakraLink:**

Niestandardowy komponent ChakraLink znajduje się w [`/src/components/chakra-config/ChakraLink.tsx`](../../next-app/src/components/chakra-config/ChakraLink.tsx).

Łączy funkcjonalność Next.js Link z możliwościami stylizacji Chakra UI.

**Przykłady użycia:**

```typescript
import ChakraLink from "@/components/chakra-config/ChakraLink";

<ChakraLink
  href="/profile"
  color="blue.500"
  fontWeight="bold"
  _hover={{ color: "blue.700" }}
  // ...inne propsy z Chakra
>
  Profil
</ChakraLink>;
```

**Dlaczego ChakraLink:**

- **Optymalizacja Next.js**: Prefetching, routing po stronie klienta
- **Stylizacja Chakra UI**: Pełny dostęp do systemu stylizacji
- **Bezpieczeństwo typów**: Wsparcie TypeScript dla props Next.js i Chakra UI
- **Spójna stylizacja**: Spójność design systemu w całej aplikacji

**Używanie envConfigLoader.ts:**

`envConfigLoader.ts` eksportuje obiekt `config`, który ładuje i waliduje zmienne środowiskowe z fallbackami:

```typescript
import { config } from "@/util/envConfigLoader";

// Użycie w kodzie
const mongoUri = config.MONGODB_URI;
const sessionSecret = config.SESSION_SECRET;
const isSecure = config.SECURE_COOKIES;
```

Jeśli zmiennej brakuje i nie ma fallbacku, aplikacja zakończy się błędem przy starcie z odpowiednim komunikatem.
