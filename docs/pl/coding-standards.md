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
import { schemaProvider } from "@/schemas/...";

export const actionName = action
  .inputSchema(schemaProvider.schema) // parsowanie i automatyczne odrzucenie gdy walidacja nie powiedzie się
  .action(async ({ parsedInput: myInputtedData }) => {
    // Logika biznesowa
    console.log(myInputtedData); // wykonuje się po stronie backendu
    return result;
  });
```

## Wzorzec Walidacji Formularzy

```typescript
// Definicja schematu
export function FormSchemaProvider() {
  const t = useTranslations("form");

  const schema = z.object({
    field: z.string().nonempty(t("field.required")),
  });

  return { schema };
}

// Użycie w komponencie
const { schema } = FormSchemaProvider();
const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

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
```

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

### Tłumaczenia

- Wszystkie teksty interfejsu w messages/pl.ts
- Klucze tłumaczeń w camelCase
- Grupowanie według funkcjonalności
- Placeholder values dla dynamicznych treści

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
