# Bridge CrossRoad - Aplikacja Next.js

Dokumentacja techniczna dla komponentu aplikacji internetowej Next.js 15 platformy Bridge CrossRoad.

## 📖 Wersje Językowe

- **🇵🇱 Polski** - Ta wersja
- **🇺🇸 English** - [README.md (EN)](../../../next-app/README.md)

## Architektura

Ta aplikacja wykorzystuje architekturę Next.js App Router z wyraźnym podziałem odpowiedzialności:

- **Warstwa Komponentów**: Komponenty UI wielokrotnego użytku z Chakra UI
- **Warstwa Serwisów**: Server Actions dla logiki biznesowej
- **Warstwa Repozytoriów**: Abstrakcja dostępu do danych
- **Warstwa Modeli**: Schematy MongoDB/Mongoose

## Stack Technologiczny

### Framework Podstawowy

- **Next.js 15**: App Router, Server Components, Server Actions
- **TypeScript**: Tryb ścisły z pełnym bezpieczeństwem typów
- **React 18**: Najnowsze funkcje z Suspense i Concurrent Rendering

### Uwierzytelnienie i Bezpieczeństwo

- **JWT**: Implementacja niestandardowa z biblioteką `jose`
- **bcryptjs**: Hashowanie haseł z rundami soli
- **next-safe-action**: Type-safe server actions z walidacją
- **Zod**: Walidacja schematów runtime

### Baza Danych i Stan

- **MongoDB**: Baza danych dokumentowa z pulą połączeń
- **Mongoose**: ODM z wsparciem TypeScript i middleware
- **TanStack React Query**: Zarządzanie stanem serwera z cachowaniem

### UI i Stylizacja

- **Chakra UI v2**: Biblioteka komponentów z niestandardowym motywem
- **Emotion**: CSS-in-JS z integracją motywów
- **next/font**: Zoptymalizowane ładowanie czcionki Montserrat
- **Responsive Design**: Podejście mobile-first

### Internacjonalizacja

- **next-intl**: Tłumaczenia po stronie serwera z wsparciem języka polskiego
- **Type-safe translations**: Pełna integracja TypeScript

## Konfiguracja Rozwoju

### Wymagania Wstępne

- Node.js 18+ (testowane z 18.17.0)
- MongoDB 6.0+ (lokalnie lub Atlas)
- npm lub pnpm jako menedżer pakietów

### Konfiguracja Środowiska

Wymagane zmienne środowiskowe:

```bash
# Baza danych
MONGODB_URI=mongodb://localhost:27017/bridge-crossroad
MONGODB_DB_NAME=bridge-crossroad

# Uwierzytelnienie
SESSION_SECRET=twoj-klucz-tajny-tutaj
EXPIRATION_TIME=3600
SECURE_COOKIES=false
```

### Instalacja i Uruchomienie

```bash
# Zainstaluj zależności
npm install

# Skopiuj szablon środowiska
cp .env.example .env.local

# Uruchom serwer deweloperski
npm run dev
```

Aplikacja będzie dostępna pod [http://localhost:3000](http://localhost:3000)

## Build i Wdrożenie

### Build Deweloperski

```bash
npm run dev          # Serwer deweloperski z hot reload
npm run type-check   # Sprawdzenie kompilacji TypeScript
npm run lint         # Sprawdzanie ESLint
```

### Build Produkcyjny

```bash
npm run build        # Zoptymalizowany build produkcyjny
npm start           # Uruchomienie serwera produkcyjnego
npm run analyze     # Analiza rozmiaru bundle
```

## Wzorce Architektury

### Wzorzec Server Actions

Wszystkie mutacje danych używają Next.js Server Actions z `next-safe-action`:

```typescript
export const createUser = action
  .inputSchema(userSchema)
  .action(async ({ parsedInput }) => {
    // Type-safe logika po stronie serwera
  });
```

### Wzorzec Repository

Dostęp do danych jest wyabstrahowany przez klasy repository:

```typescript
export class UserRepository {
  static async findByEmail(email: string) {
    await dbConnect();
    return await User.findOne({ email }).toObject();
  }
}
```

### Walidacja Formularzy

Walidacja po stronie klienta i serwera ze schematami Zod:

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

## Wytyczne Rozwoju

### Struktura Komponentów

- Server Components domyślnie
- Client Components tylko gdy potrzebne (`'use client'`)
- Domyślne eksporty dla stron i layoutów
- Interfejsy props z nazwą komponentu + sufiks `Props`

### Zarządzanie Stanem

- TanStack React Query dla stanu serwera
- React Context dla złożonego stanu klienta
- Lokalne `useState` dla stanu komponentu

### Konwencje Stylizacji

- Komponenty Chakra UI z niestandardowym motywem
- Niestandardowy komponent ChakraLink do nawigacji
- Responsive design z punktami przerwania Chakra
- Niestandardowa paleta kolorów i skala typografii

## Implementacja Bezpieczeństwa

### Przepływ Uwierzytelnienia

- Tokeny JWT przechowywane w HTTP-only cookies
- Walidacja sesji po stronie serwera na chronionych trasach
- Automatyczne odświeżanie tokenów i bezpieczne wylogowanie
- Hashowanie haseł z bcryptjs (12 rund soli)

### Ochrona Danych

- Walidacja input ze schematami Zod
- Zapobieganie SQL injection z Mongoose ODM
- Ochrona XSS z wbudowaną sanityzacją Next.js
- Ochrona CSRF przez SameSite cookies

## Optymalizacje Wydajności

### Optymalizacja Bundle

- Dynamiczne importy dla dzielenia kodu
- Zoptymalizowane importy pakietów dla Chakra UI, React Icons
- Komponent Next.js Image dla zoptymalizowanych obrazów
- Optymalizacja czcionek z next/font

### Wydajność Bazy Danych

- Pula połączeń MongoDB
- Indeksowane zapytania dla wyszukiwania użytkowników
- Potoki agregacji dla złożonych zapytań
- Sanityzacja danych przed transmisją do klienta

## Strategia Testowania

### Testowanie Komponentów

```bash
npm run test          # Jest + React Testing Library
npm run test:watch    # Tryb watch dla rozwoju
```

### Bezpieczeństwo Typów

```bash
npm run type-check    # Kompilacja TypeScript
npm run lint          # ESLint z regułami TypeScript
```

## Dokumentacja

- **Przewodnik Architektury**: [🇵🇱 `../../docs/pl/architecture.md`](../../docs/pl/architecture.md) | [🇺🇸 `../../docs/architecture.md`](../../docs/architecture.md)
- **Standardy Kodowania**: [🇵🇱 `../../docs/pl/coding-standards.md`](../../docs/pl/coding-standards.md) | [🇺🇸 `../../docs/coding-standards.md`](../../docs/coding-standards.md)
- **Dokumentacja API**: Generowana z interfejsów TypeScript
- **Dokumentacja Komponentów**: Planowana integracja Storybook

## Współtworzenie

### Workflow Rozwoju

1. Stwórz branch feature z `main`
2. Przestrzegaj standardów kodowania i wzorców architektury
3. Dodaj typy TypeScript i schematy walidacji
4. Uwzględnij polskie tłumaczenia dla nowego tekstu
5. Testuj przypadki błędów i warunki skrajne
6. Prześlij pull request z kompleksowym opisem

### Standardy Jakości Kodu

- Konfiguracja ESLint z regułami TypeScript
- Integracja Prettier dla spójnego formatowania
- GitHub Actions dla potoku CI/CD

---

**Projekt Pracy Inżynierskiej** autorstwa Szymona Kubiczka, Bartłomieja Szubiaka i Joanny Konieczny

Dla przeglądu projektu i informacji ogólnych, zobacz [główny README](../README.md).
