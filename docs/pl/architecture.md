# Przewodnik Rozwoju - Bridge Crossroad

Ten dokument opisuje praktyki deweloperskie, architekturę i standardy kodowania dla projektu Bridge Crossroad.

## 📖 Wersje Językowe

- **🇵🇱 Polski** - Ta wersja
- **🇺🇸 English** - [architecture.md](../architecture.md)

## Przegląd Architektury

Aplikacja wykorzystuje nowoczesną architekturę Next.js z wyraźnym podziałem odpowiedzialności:

```
┌─────────────────────────────────────────┐
│                 Klient                  │
├─────────────────────────────────────────┤
│           Warstwa Komponentów           │
├─────────────────────────────────────────┤
│            Warstwa Serwisów             │
│         (Server Actions)                │
├─────────────────────────────────────────┤
│         Warstwa Repozytoriów            │
│         (Dostęp do Danych)              │
├─────────────────────────────────────────┤
│             Warstwa Modeli              │
│         (MongoDB/Mongoose)              │
└─────────────────────────────────────────┘
```

## Tutorial Next.js

Klient odnosi się do przeglądarki.

- Eksporty komponentów UI i stron (page.tsx, layout.tsx...) muszą być eksportami domyślnymi
- Typy komponentów: po stronie serwera, po stronie klienta ('use client') - po stronie serwera jest domyślnie

**Wyjaśnienie Typów Komponentów:**

- **Komponenty Serwera** (domyślnie): Renderowane na serwerze, nie mogą używać API specyficznych dla przeglądarki, hooków lub obsługi zdarzeń
- **Komponenty Klienta** ('use client'): Renderowane w przeglądarce, mogą używać hooków, obsługi zdarzeń i API przeglądarki
- **Server-only** ('server-only'): Kod, który działa wyłącznie na serwerze (backend)
- **Server Actions** ('use server'): Funkcje zadeklarowane na serwerze, ale mogą być wywoływane przez klienta jako endpointy

**Server Actions**

Funkcje, które wykonują się na serwerze, ale mogą być wywoływane z klienta jako endpointy API. Zapewniają bezproblemowy sposób obsługi przesyłania formularzy i logiki po stronie serwera bez tworzenia oddzielnych tras API.

## Struktura Katalogów

### `/src/app` - Next.js App Router

URL-e są budowane ze struktury folderów. Foldery mogą zawierać:

- **layout.tsx** - Komponent layoutu strony
- **page.tsx** - Właściwy komponent strony
- **loading.tsx** - Komponent UI ładowania wyświetlany podczas nawigacji
- **error.tsx** - Komponent UI błędu do obsługi błędów
- **not-found.tsx** - Komponent strony 404
- **global-error.tsx** - Komponent globalnej obsługi błędów
- **route.ts** - Obsługa tras API (GET, POST, itp.)
- **middleware.ts** - Middleware żądań/odpowiedzi
- **template.tsx** - Podobny do layout, ale ponownie renderuje podczas nawigacji
- **default.tsx** - Komponent zapasowy dla równoległych tras

- Struktura plików oparta na trasach
- Renderowanie po stronie serwera i routing
- Komponenty layoutu dla wspólnego UI
- Grupy tras dla logicznej organizacji:
  - `(logged)` - Chronione trasy wymagające uwierzytelnienia
  - `auth` - Strony uwierzytelnienia

### `/src/components` - Komponenty UI

Musi odpowiadać strukturze folderów z `/src/app`, na przykład:

```
components/
├── auth/                   # Formularze uwierzytelnienia
├── onboarding/            # Wieloetapowy onboarding
```

**Wytyczne dla Komponentów:**

- Używaj ChakraUI do stylizacji
- Pamiętaj, że mamy własną niestandardową paletę kolorów
- Nazywaj komponenty odpowiednio i opisowo

### `/src/services` - Logika Biznesowa

Server Actions (czyli endpointy) implementujące logikę biznesową:

- **Folder grupujący** (np. auth) - nazwany tak samo jak odpowiadająca strona
- **actions.ts** - kod endpointów
- **server-only** - kod funkcjonalności dla endpointów, który powinien wykonywać się tylko po stronie serwera, plik musi zaczynać się od 'server-only'

Przykład:

```
services/
├── auth/
│   ├── actions.ts         # Login, rejestracja, wylogowanie
│   └── server-only/       # Zarządzanie sesjami (funkcje server-only)
├── onboarding/
│   └── actions.ts         # Ukończenie onboardingu
└── action-lib.ts          # Zbiorowa konfiguracja logiki endpointów
```

**Wytyczne dla Serwisów:**

- Używaj dyrektywy `"use server"` dla server actions
- Waliduj input ze schematami Zod
- Obsługuj błędy gracefully z sensownymi komunikatami
- Używaj `next-safe-action`

**Przykład bez next-safe-action:** ❌

```typescript
"use server";

export async function loginUser(formData: LoginData) {
  // Ręczna walidacja
  }
}
```

**Przykład z next-safe-action:** ✅

```typescript
"use server";
import { action } from "@/services/action-lib";
import { loginSchema } from "@/schemas/auth";

export const loginUser = action
  .inputSchema(loginSchema) // jeśli walidacja nie powiedzie się, będzie widoczna dla klienta jako błąd walidacji
  });
```

**Wykonanie takiej akcji zwraca:**

Gdy wywołujesz server action next-safe-action, zwraca obiekt z następującą strukturą:

```typescript
// Przypadek sukcesu
{
  data: YourReturnType,           // Dane, które zwróciłeś z .action()
  bindArgsValidationErrors: []
}

// Przypadek błędu walidacji
{
  data: null,
  bindArgsValidationErrors: []
}

// Przypadek błędu serwera
{
  data: null,
  bindArgsValidationErrors: []
}
```

**Dlaczego używać next-safe-action:**

- **Automatyczna walidacja input**: Schematy Zod są automatycznie stosowane
- **Bezpieczeństwo typów**: Typy input i output są wnioskowane ze schematów
- **Obsługa błędów**: Spójna obsługa błędów we wszystkich akcjach
- **Integracja po stronie klienta**: Łatwa integracja z hookami React
- **Błędy walidacji**: Automatyczne wyświetlanie błędów walidacji pól formularza
- **Wydajność**: Wbudowane optymistyczne aktualizacje i stany ładowania

### `/src/repositories` - Warstwa Dostępu do Danych

Operacje bazodanowe wyabstrahowane od logiki biznesowej:

- Operujemy na obiektach DTO
- Zwracamy przetworzone (nie sanityzowane) dane lub null
- Logika rzucania błędów nie powinna być na tym poziomie aplikacji
- Tworzymy transakcje gdy potrzebne

Przykład:

```
repositories/
├── user-auth.ts           # Operacje uwierzytelnienia użytkownika
└── onboarding.ts          # Operacje danych onboardingu
```

**Wytyczne dla Repozytoriów:**

- Używaj dyrektywy `"server-only"`
- Zawsze łącz się z bazą danych przed operacjami
- Zwracaj wstępnie zserializowane obiekty (używaj `.toObject()`) - nadal zawierają rzeczy jak timestampy pobierania z bazy, ale nie mają już niebezpiecznych niskopoziomowych metod (z prototypu)
- Obsługuj błędy bazy danych odpowiednio
- Abstrahuj logikę specyficzną dla bazy danych

### `/src/models` - Modele Danych

Schematy MongoDB używające Mongoose:

To są schematy tylko dla obiektów DTO.

- Pamiętaj o pisaniu odpowiednich typów, które odpowiadają modelom Mongoose
- Używaj Types.ObjectId dla ID obiektów
- Pamiętaj, że każdy obiekt ma `_id`, nawet zagnieżdżone (chociaż nie musisz ich deklarować, jeśli ich nie potrzebujesz)

```typescript
// Zapobiegaj ponownemu rejestrowaniu modelu (problem z hot reload w Next.js)
export default models.User || model<IUserDTO>("User", UserSchema);
```

Przykład:

```
models/
└── user.ts               # Model użytkownika z walidacją
```

**Wytyczne dla Modeli:**

- Definiuj typy TypeScript
- Uwzględniaj kompleksową walidację - te są tylko na poziomie bazy danych!
- Używaj middleware Mongoose dla reguł biznesowych
- Implementuj odpowiednie indeksowanie dla wydajności

### `/src/schemas` - Schematy Walidacji

Schematy Zod dla walidacji runtime:

```
schemas/
├── common.ts              # Wspólne narzędzia walidacyjne
├── model/                 # Związane z obiektami bazy danych, ale nie DTOs
│   └── user/
│       ├── user-schema.ts      # Schemat i stałe używane w całej aplikacji dla klienta i backendu
│       └── user-types.ts       # Typy wnioskowane ze schematu
├── pages/                 # Związane ze stronami - np. walidacja pól formularza dla backendu lub klienta
│   ├── auth/
│   └── onboarding/
│       ├── onboarding-schema.ts # Wszystkie schematy onboarding i stałe walidacyjne
│       └── onboarding-types.ts  # Wszystkie typy onboarding wnioskowane ze schematów
```

### `/src/i18n` - Internacjonalizacja

Konfiguracja dla systemu tłumaczeń z pełnym bezpieczeństwem typów.

Tłumaczenia znajdują się w `/messages/pl.ts`

Tłumaczenia to obiekt, gdzie każda wartość musi być stringiem.

**⚠️ Ważne: Używaj zawsze nakładki `typed-translations` zamiast next-intl bezpośrednio**

**Przykład Użycia z typed-translations:**

```typescript
import { useTranslations, getTranslations } from "@/lib/typed-translations";

function MyComponent() {
  const t = useTranslations("common.buttons"); // ✅ Type-safe namespace
  return <button>{t("save")}</button>; // ✅ Autocomplete
}

// Przykład komponentu serwera
async function ServerComponent() {
  const t = await getTranslations("validation.user");
  return <div>{t("emailRequired")}</div>; // ✅ Type-safe
}
```

**Korzyści nakładki typed-translations:**

- **Walidacja namespace**: TypeScript wykrywa nieprawidłowe namespace w czasie kompilacji
- **Autouzupełnianie**: Pełne wsparcie IDE dla wszystkich kluczy tłumaczeń
- **Bezpieczeństwo refaktoryzacji**: Zmiany kluczy automatycznie wykrywają błędy
- **Type TranslationKeys<T>**: Pomocniczy typ do walidacji namespace w funkcjach

**Struktura Pliku Tłumaczeń:**

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
} as const; // ⚠️ Ważne: as const dla wnioskowania typów
```

```
i18n/
├── config.ts              # Konfiguracja lokalizacji
└── request.ts             # Obsługa lokalizacji na podstawie żądań
```

### więcej o tym:

https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
https://next-intl.dev/docs/usage/messages

### `/src/routes.ts` - Stałe Tras

Scentralizowane definicje tras dla bezpiecznej nawigacji typów:

**Wytyczne Użycia:**

- Zawsze importuj i używaj `ROUTES` zamiast hardkodowanych stringów
- Aktualizuj ten plik przy dodawaniu nowych tras
- Używaj wnioskowania typów TypeScript do walidacji tras

### `/src/util` - Narzędzia

Wspólne funkcje narzędziowe:

Przykład:

```
util/
├── connect-mongo.ts       # Połączenie z bazą danych
├── date.ts                # Narzędzia dat - nazwy miesięcy (przetłumaczone)
└── envConfigLoader.ts     # Ładowarka zmiennych środowiskowych
```

**Używanie envConfigLoader.ts:**

`envConfigLoader.ts` eksportuje obiekt `config`, który ładuje i waliduje zmienne środowiskowe z fallbackami:

```typescript
import { config } from "@/util/envConfigLoader";

// Użycie w kodzie
const mongoUri = config.MONGODB_URI;
const sessionSecret = config.SESSION_SECRET;
const isSecure = config.SECURE_COOKIES;
```

**Dostępne Zmienne Środowiskowe:**

- `SESSION_SECRET` - Klucz tajny do szyfrowania sesji (fallback: "123")
- `EXPIRATION_TIME` - Czas wygaśnięcia sesji w sekundach (fallback: "3600")
- `SECURE_COOKIES` - Czy używać bezpiecznych cookies (fallback: "false")
- `MONGODB_URI` - String połączenia MongoDB (wymagane, bez fallback)
- `MONGODB_DB_NAME` - Nazwa bazy danych MongoDB (wymagane, bez fallback)

Jeśli zmienna brakuje i nie ma fallback, aplikacja ulegnie awarii przy starcie z odpowiednim komunikatem.

## Wytyczne Testowania

### Testowanie Komponentów

- Testuj interakcje użytkownika
- Testuj stany błędów
- Mockuj zewnętrzne zależności
- Testuj dostępność

### Testowanie Integracyjne

- Testuj kompletne przepływy użytkownika
- Testuj endpointy API
- Testuj operacje bazodanowe
- Testuj przepływy uwierzytelnienia

## Obsługa Błędów

### Błędy po Stronie Klienta

```typescript
// Granice błędów komponentów
// Błędy walidacji formularzy
// Obsługa błędów sieciowych
```

### Błędy po Stronie Serwera

```typescript
// Błędy walidacji z next-safe-action
// Błędy bazy danych
// Błędy uwierzytelnienia
// Błędy logiki biznesowej
```

## Workflow Rozwoju

### Setup

1. Sklonuj repozytorium
2. Zainstaluj zależności: `npm install`
3. Skonfiguruj zmienne środowiskowe
4. Uruchom serwer deweloperski: `npm run dev`

### Jakość Kodu

- ESLint do lintowania kodu
- TypeScript do sprawdzania typów
- Prettier do formatowania kodu (jeśli skonfigurowane)

### Workflow Git

- Branche feature dla nowego rozwoju
- Sensowne komunikaty commit
- Przeglądy pull requestów
- Automatyczne testowanie na CI/CD

## Konfiguracja Środowiska

Możesz sprawdzić, które zmienne są ładowane w [envConfigLoader](../next-app/src/util/envConfigLoader.ts).
Dodatkowo są one opisane w [.env.example](../next-app/.env.example).

Jeśli jakakolwiek zmienna brakuje, zostanie użyty fallback i otrzymasz komunikat ostrzegawczy.
Jeśli zmienna jest krytyczna (musi być podana), aplikacja ulegnie awarii przy starcie z odpowiednim komunikatem.

### Development vs Production

- Różne połączenia z bazą danych
- Tryby debugowania
- Integracja analityki
- Serwisy raportowania błędów

## Wdrożenie

### Proces Budowania

```bash
npm run build    # Build produkcyjny
npm run analyze  # Analiza bundla
npm start        # Serwer produkcyjny
```

### Monitorowanie Wydajności

- Analiza rozmiaru bundla
- Monitorowanie Core Web Vitals
- Wydajność zapytań do bazy danych
- Śledzenie błędów

---

**Projekt Pracy Inżynierskiej** autorstwa Szymona Kubiczka, Bartłomieja Szubiaka i Joanny Konieczny

Dla przeglądu projektu i informacji ogólnych, zobacz [główny README](../README.md).
