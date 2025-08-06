# Stand### Zarządzanie Trasami

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
- **Refaktoryzowanie**: Łatwe aktualizowanie tras w całej aplikacji
- **Wsparcie IDE**: Autouzupełnianie i IntelliSense dla ścieżek tras
- **Spójność**: Pojedyncze źródło prawdy dla całej nawigacji
- **Dokumentacja**: Przejrzysty przegląd wszystkich dostępnych tras

**Przy dodawaniu nowych tras:**

1. Dodaj trasę do obiektu `ROUTES` w `/src/routes.ts`
2. Używaj opisowej struktury zagnieżdżonej dla powiązanych tras
3. Zawsze dodawaj asercję `as const` dla wnioskowania typów
4. Zaktualizuj typ `RouteKeys` jeśli potrzebne

### Wytyczne TypeScriptrdy Kodowania

## 📖 Wersje Językowe

- **🇵🇱 Polski** - Ta wersja
- **🇺🇸 English** - [coding-standards.md](../coding-standards.md)

## Wytyczne TypeScript

- Włącz tryb ścisły
- Używaj odpowiednich adnotacji typów
- Preferuj interfejsy nad types dla kształtów obiektów
- Używaj utility types gdy odpowiednie
- Unikaj `any` - używaj `unknown` dla naprawdę nieznanych danych

## Wzorce Komponentów

```typescript
// Przykład struktury komponentu
"use client"; // Tylko gdy potrzebne są funkcje po stronie klienta

import { ComponentProps } from "react"; // nie używaj import * as React - skrajnie nieoptymalne

interface ComponentNameProps { // ta sama nazwa co komponent + Props
  required: string;
  optional?: boolean;
  onAction?: () => void;
}

export default function ComponentName({ // export default function nie arrow function
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

## Wzorzec Server Action

```typescript
"use server";

import { action } from "@/services/action-lib";
import { userSchema } from "@/schemas/model/user/user-schema";
// lub dla schematów onboarding:
// import { onboardingFirstPageSchema } from "@/schemas/pages/onboarding/onboarding-schema";

export const actionName = action
  .inputSchema(userSchema) // parsowanie i automatyczne odrzucenie gdy walidacja nie powiedzie się
  .action(async ({ parsedInput: myInputtedData }) => {
    // Logika biznesowa
    console.log(myInputtedData); // wykonuje się po stronie backendu
    return result;
  });
```

## Wzorzec Walidacji Formularzy

```typescript
// Definicja schematu z kluczami tłumaczeń
import { z } from "zod";
import type { ValidNamespaces } from "@/lib/typed-translations";

// ✅ Używaj kluczy tłumaczeń bezpośrednio w definicjach schematów
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

// Użycie w komponencie z hook'iem tłumaczeń
import {
  useTranslations,
  useTranslationsWithFallback,
} from "@/lib/typed-translations";

function ThirdPage() {
  const t = useTranslations("OnboardingPage.thirdPage"); // Dla etykiet, placeholderów
  const tValidation = useTranslationsWithFallback(); // Dla komunikatów walidacji ze schematu

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
    // Obsługa wysłania formularza
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

**Ważne:**

- **Brak providerów schematów**: Używaj kluczy tłumaczeń bezpośrednio w definicjach schematów
- **Bezpieczeństwo typów**: Rzutuj komunikaty błędów na `ValidNamespaces` dla bezpieczeństwa typów
- **Obsługa błędów**: Używaj `useTranslationsWithFallback()` dla komunikatów błędów walidacji
- **Rozdzielenie obowiązków**:
  - `useTranslations("namespace")` dla etykiet UI i placeholderów
  - `useTranslationsWithFallback()` dla dynamicznych komunikatów błędów ze schematów
- **Pola opcjonalne**: Używaj wzorca `.transform(emptyStringToUndefined).pipe(schema.optional())`

**Przykład z rzeczywistego schematu onboarding:**

```typescript
// Zaawansowana walidacja z transformacją i polami opcjonalnymi
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

// Transformacja pustych stringów na undefined dla pól opcjonalnych
const emptyStringToUndefined = (value: string | undefined) =>
  value === "" ? undefined : value;

// Kompletny schemat z wieloma polami opcjonalnymi
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

**Przykład z rzeczywistego schematu logowania:**

```typescript
// Zaawansowana walidacja z logiką warunkową
const nicknameOrEmailSchema = z
  .string()
  .nonempty(
    "validation.pages.auth.login.nicknameOrEmail.required" as ValidNamespaces
  )
  .superRefine((value, ctx) => {
    if (value.includes("@")) {
      // Walidacja emaila
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
      // Walidacja nickname
      const result = nicknameSchema.safeParse(value);
      if (!result.success) {
        result.error.errors.forEach((err) => {
          ctx.addIssue({
            code: "custom",
            message: err.message,
          });
        });
      }
    }
  });
```

````

## Uwierzytelnienie i Autoryzacja

### Zarządzanie Sesjami

- Tokeny JWT przechowywane w HTTP-only cookies
- Walidacja sesji po stronie serwera
- Automatyczne odświeżanie tokenów
- Bezpieczne wylogowanie z czyszczeniem tokenów

### Ochrona Tras

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
````

### Wzorce Uprawnień

- Dostęp oparty na rolach przez dane użytkownika
- Guardy na poziomie tras w komponentach layout
- Sprawdzanie uprawnień na poziomie komponentów

## Wzorce Bazy Danych

### Zarządzanie Połączeniami

```typescript
// Zawsze używaj narzędzia połączenia
import dbConnect from "@/util/connect-mongo";

export async function databaseOperation() {
  await dbConnect();
  // Operacje bazodanowe...
}
```

### Sanityzacja Danych

```typescript
// Zawsze sanityzuj dane przed zwróceniem do klienta w server actions
import { sanitizeUser } from "@/sanitizers/server-only/user-sanitize";

const user = await User.findById(id);
return sanitizeUser(user);
```

## Obsługa Formularzy

### Formularze Wieloetapowe

- Zarządzanie stanem oparte na kontekście
- Walidacja na poziomie strony
- Guardy nawigacji
- Śledzenie postępu

### Strategia Walidacji

- Walidacja po stronie klienta z Zod
- Walidacja po stronie serwera dla bezpieczeństwa
- Informacje zwrotne o walidacji w czasie rzeczywistym
- Zinternacjonalizowane komunikaty błędów

## Zarządzanie Stanem

### Stan Serwera

- TanStack React Query dla stanu serwera
- Automatyczne cachowanie i unieważnianie
- Odświeżanie w tle
- Optymistyczne aktualizacje

### Stan Klienta

- React Context dla złożonego wspólnego stanu
- useState dla stanu lokalnego komponentu
- useReducer dla złożonych przejść stanu

## Optymalizacja Wydajności

### Dzielenie Kodu

- Dynamiczne importy dla ciężkich komponentów
- Dzielenie oparte na trasach (automatyczne)
- Dzielenie na poziomie komponentów gdzie odpowiednie

Dziel tylko jeśli widzisz, że komponent będzie duży i może mieć loader.

Nie używaj React.lazy, używaj dynamicznych importów Next.js zamiast tego.

**Dlaczego używać dynamicznych importów Next.js zamiast React.lazy:**

- **Lepsze wsparcie SSR**: Dynamiczne importy Next.js działają bezproblemowo z renderowaniem po stronie serwera
- **Automatyczne dzielenie kodu**: Next.js automatycznie obsługuje bundlowanie i ładowanie
- **Wbudowane stany ładowania**: Zintegrowane z plikami loading.tsx Next.js
- **Lepsza wydajność**: Zoptymalizowane dla systemu budowania Next.js
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

// Dla komponentów, które powinny ładować się tylko po stronie klienta
const ClientOnlyComponent = dynamic(() => import("./ClientOnlyComponent"), {
  ssr: false,
  loading: () => <div>Ładowanie...</div>,
});
```

### Optymalizacja Bundla

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

### Optymalizacja Obrazów

- Używaj komponentu Image z Next.js
- Odpowiedni sizing i wybór formatu
- Lazy loading domyślnie

Nie używaj Image z Chakra UI, używaj Image z Next.js zamiast tego.

### Optymalizacja Linków

Nie używaj Link z Chakra UI ani Link z Next.js bezpośrednio. Używaj naszego niestandardowego komponentu ChakraLink zamiast tego.

**Użycie Komponentu ChakraLink:**

Niestandardowy komponent ChakraLink znajduje się w [`/src/components/chakra-config/ChakraLink.tsx`](../../next-app/src/components/chakra-config/ChakraLink.tsx).

Ten komponent łączy funkcjonalność Next.js Link z możliwościami stylizacji Chakra UI.

**Przykłady użycia:**

```typescript
import ChakraLink from "@/components/chakra-config/ChakraLink";

<ChakraLink
  href="/profile"
  color="blue.500"
  fontWeight="bold"
  _hover={{ color: "blue.700" }}
  ...inne props z Chakra
>
  Profil
</ChakraLink>
```

**Dlaczego używać ChakraLink:**

- **Optymalizacja Next.js**: Zawiera wszystkie optymalizacje Next.js Link (prefetching, routing po stronie klienta)
- **Stylizacja Chakra UI**: Pełny dostęp do systemu stylizacji i props Chakra UI
- **Bezpieczeństwo typów**: Odpowiednie wsparcie TypeScript dla props Next.js i Chakra UI
- **Spójna stylizacja**: Utrzymuje spójność systemu projektowania w całej aplikacji

**Używanie envConfigLoader.ts:**

`envConfigLoader.ts` eksportuje obiekt `config`, który ładuje i waliduje zmienne środowiskowe z fallbackami:

```typescript
import { config } from "@/util/envConfigLoader";

// Użycie w kodzie
const mongoUri = config.MONGODB_URI;
const sessionSecret = config.SESSION_SECRET;
const isSecure = config.SECURE_COOKIES;
```

Jeśli zmienna brakuje i nie ma fallback, aplikacja ulegnie awarii przy starcie z odpowiednim komunikatem.

## Bezpieczeństwo

### Walidacja Input

- Schematy Zod dla wszystkich danych wejściowych
- Sanityzacja po stronie serwera
- Ochrona przed atakami injection
- Walidacja typu plików dla uploadów

### Ochrona CSRF

- SameSite cookies
- Tokeny CSRF dla newralgicznych operacji
- Walidacja origin headers

### Bezpieczeństwo Sesji

- HTTP-only cookies
- Bezpieczne flagi dla HTTPS
- Rotacja tokenów sesji
- Timeouty sesji

## Wzorce Testowania

### Testowanie Jednostkowe

```typescript
// Testowanie utility functions
// Testowanie logiki biznesowej
// Testowanie walidacji schematów
```

### Testowanie Komponentów

```typescript
// Renderowanie komponentów
// Interakcje użytkownika
- Stany ładowania i błędów
```

### Testowanie Integracyjne

```typescript
// Przepływy end-to-end
// API endpoints
// Operacje bazodanowe
```

## Konwencje Dokumentacji

### Komentarze w Kodzie

```typescript
/**
 * Opis funkcji w języku polskim
 * @param param - opis parametru
 * @returns opis zwracanej wartości
 */
function exampleFunction(param: string): boolean {
  // Komentarz w kodzie po polsku
  return true;
}
```

### README Files

- Instrukcje w języku polskim
- Przykłady użycia
- Wymagania środowiska
- Kroki troubleshootingu

### API Documentation

- OpenAPI/Swagger specs
- Przykłady żądań i odpowiedzi
- Kody błędów i ich znaczenie
- Limity rate limiting

## Wytyczne Lokalizacji

### System Typowanych Tłumaczeń

Aplikacja wykorzystuje niestandardową nakładkę na next-intl (`src/lib/typed-translations.ts`), która zapewnia pełne bezpieczeństwo typów i walidację namespace:

**Podstawowe użycie:**

```typescript
import { useTranslations, getTranslations } from "@/lib/typed-translations";

// ✅ Komponenty klienta - automatyczne autouzupełnianie
const t = useTranslations();
t("common.appName"); // TypeScript sprawdza poprawność klucza

// ✅ Komponenty serwera
const t = await getTranslations();
const message = t("Auth.LoginPage.title");
```

**Bezpieczne namespace z walidacją:**

```typescript
// ✅ Poprawne użycie - namespace istnieje
const authT = useTranslations("Auth");
authT("LoginPage.title"); // Autouzupełnianie dla kluczy Auth.*

// ❌ Błąd kompilacji - nieprawidłowy namespace
const invalidT = useTranslations("NonExistent"); // TypeScript error!
```

**Typ TranslationKeys dla walidacji namespace:**

```typescript
// Sprawdza poprawność namespace w czasie kompilacji
type ValidKeys = TranslationKeys<"Auth">; // ✅ Zwraca klucze z Auth
type InvalidKeys = TranslationKeys<"BadNamespace">; // ❌ never type

// Użycie w funkcjach pomocniczych
function getAuthMessage<T extends string>(
  namespace: T,
  key: TranslationKeys<T>
): string {
  const t = useTranslations(namespace);
  return t(key);
}

// ✅ Działa poprawnie
getAuthMessage("Auth", "LoginPage.title");

// ❌ Błąd kompilacji
getAuthMessage("Invalid", "some.key");
```

**Korzyści systemu typowanych tłumaczeń:**

- **Autouzupełnianie**: Pełne wsparcie IDE dla kluczy tłumaczeń
- **Walidacja namespace**: TypeScript wykrywa nieprawidłowe namespace
- **Bezpieczeństwo refaktoryzacji**: Zmiana kluczy automatycznie wykrywa błędy
- **Interpolacja wartości**: Type-safe wstawianie zmiennych do tekstów
- **Wsparcie rich content**: Bezpieczne używanie komponentów React w tłumaczeniach

### Tłumaczenia

- Wszystkie teksty interfejsu w messages/pl.ts
- Klucze tłumaczeń w camelCase
- Grupowanie według funkcjonalności
- Placeholder values dla dynamicznych treści
- **Zawsze używaj typed-translations zamiast next-intl bezpośrednio**

**Przykład struktury tłumaczeń:**

```typescript
// messages/pl.ts
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
} as const; // Ważne: as const dla wnioskowania typów
```

### Formatowanie Dat i Liczb

```typescript
// Używaj narzędzi locale-aware
const formatter = new Intl.DateTimeFormat("pl-PL");
const currency = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
});
```

## Monitoring i Logging

### Logging Strukturalny

```typescript
// Używaj strukturalnych logów
console.log({
  action: "user_login",
  userId: user.id,
  timestamp: new Date().toISOString(),
  success: true,
});
```

### Metrics i Analytics

- Performance metrics
- User behavior tracking
- Error rates monitoring
- Business metrics

---

**Projekt Pracy Inżynierskiej** autorstwa Szymona Kubiczka, Bartłomieja Szubiaka i Joanny Konieczny

Dla przeglądu projektu i informacji ogólnych, zobacz [główny README](../README.md).
