# 🌉 Bridge CrossRoad

> _Łączymy akademicki świat brydża w Polsce_ 🎴

**Projekt Pracy Inżynierskiej** - Nowoczesna platforma internetowa dla społeczności brydżowej, stworzona specjalnie dla środowiska akademickiego. Bridge CrossRoad to miejsce, gdzie studenci, wykładowcy i entuzjaści brydża mogą się spotykać, uczyć i rozwijać swoją pasję!

**Autorzy**: Szymon Kubiczek, Bartłomiej Szubiak, Joanna Konieczny

_Pierwotnie opracowano dla **Just Bridge AGH**, ale zaprojektowano tak, aby można było łatwo dostosować do dowolnego akademickiego klubu brydżowego._

## ✨ Dlaczego Bridge CrossRoad?

🎯 **Misja**: Digitalizacja i modernizacja akademickiego brydża w Polsce  
🚀 **Wizja**: Stworzenie centralnego centrum dla wszystkich entuzjastów brydża na uniwersytetach  
🌟 **Cel**: Ułatwienie nauki, organizacji turniejów i budowania społeczności

## 🎮 Główne Funkcje

### 👤 System Użytkowników

- 🔐 **Bezpieczna rejestracja** z zaawansowaną walidacją
- 🎓 **Profile akademickie** z przynależnością do uniwersytetu i klubu
- 📊 **Śledzenie postępów** w nauce brydża
- 🏆 **Rankingi i osiągnięcia** dla graczy

### 🎯 Onboarding i Personalizacja

- 📝 **Wieloetapowy formularz** ankiety
- 🎪 **Ocena doświadczenia** w brydżu (od początkującego do eksperta)
- 🏫 **Wybór grupy treningowej** z predefiniowanej listy
- 🔗 **Integracja z platformami brydżowymi** (Cezar, BBO, Cuebids)

### 🌍 Społeczność i Komunikacja

- 💬 **Forum dyskusyjne** z kategoryzacją tematów
- 📅 **Kalendarz wydarzeń brydżowych** na uniwersytetach
- 🤝 **System znajomości** i tworzenie zespołów
- 📢 **Powiadomienia** o nadchodzących turniejach

### 🏆 Turnieje i Gry

- 🎪 **Organizacja turniejów międzyuniwersyteckich**
- 📈 **System rankingowy** z historią gier
- 🏅 **Certyfikaty i nagrody** za osiągnięcia
- 📊 **Statystyki** i analiza gier

## 🛠️ Stack Technologiczny

### Frontend 🎨

- **Next.js 15** - Najnowsza wersja z App Router
- **TypeScript** - Pełne typowanie dla bezpieczeństwa kodu
- **Chakra UI** - Nowoczesny system projektowania
- **React Query** - Inteligentne zarządzanie stanem serwera

### Backend ⚙️

- **Next.js Server Actions** - Endpointy logiki biznesowej
- **MongoDB** - Elastyczna baza danych dokumentowa
- **Mongoose** - Eleganckie modelowanie danych
- **JWT** - Bezpieczne uwierzytelnianie użytkowników

### DevOps i Narzędzia 🔧

- **ESLint + TypeScript** - Wysoka jakość kodu
- **Zod** - Walidacja schematów w czasie wykonania
- **next-intl** - Pełne wsparcie języka polskiego
- **Git Flow** - Profesjonalny przepływ pracy deweloperskiej

## 📁 Struktura Projektu

```
bridge-crossroad/
├── 📚 docs/                    # Dokumentacja techniczna
│   ├── architecture.md         # Architektura systemu
│   ├── coding-standards.md     # Standardy programowania
│   └── pl/                     # Polskie wersje dokumentacji
│       ├── README.md           # Ten plik
│       ├── architecture.md     # Przewodnik architektury
│       └── coding-standards.md # Standardy kodowania
├── 🚀 next-app/               # Aplikacja Next.js
│   ├── src/
│   │   ├── app/               # Routing i strony
│   │   ├── components/        # Komponenty UI
│   │   ├── services/          # Logika biznesowa
│   │   ├── repositories/      # Warstwa dostępu do danych
│   │   ├── models/            # Modele MongoDB
│   │   └── schemas/           # Walidacja Zod
│   └── public/                # Zasoby statyczne
└── 📖 README.md               # Główny plik README
```

## 🚀 Szybki Start

### 📋 Wymagania

- **Node.js 18+** 📦
- **MongoDB** (lokalnie lub Atlas) 🗄️
- **npm/pnpm** jako menedżer pakietów ⚡

### ⚡ Instalacja

```bash
# 1️⃣ Sklonuj repozytorium
git clone https://github.com/your-repo/bridge-crossroad.git

# 2️⃣ Przejdź do katalogu aplikacji
cd bridge-crossroad/next-app

# 3️⃣ Zainstaluj zależności
npm install

# 4️⃣ Skonfiguruj środowisko i wypełnij dane
cp .env.example .env.local

# 5️⃣ Uruchom serwer deweloperski
npm run dev
```

🎉 **Aplikacja dostępna pod**: [http://localhost:3000](http://localhost:3000)

## 🎯 Status Rozwoju

### ✅ Ukończone

- [x] 🔐 System rejestracji i logowania
- [x] 📝 Wieloetapowy onboarding użytkownika
- [x] 🎨 Responsywny interfejs użytkownika
- [x] 🌍 Pełna lokalizacja w języku polskim
- [x] 📱 Optymalizacja mobilna

## 📄 Licencja

Projekt pracy inżynierskiej na **Akademii Górniczo-Hutniczej im. Stanisława Staszica w Krakowie**.

## 📖 Wersje Językowe

- **🇵🇱 Polski** - Ta wersja
- **🇺🇸 English** - [README.md](../README.md)

## 📚 Dodatkowa Dokumentacja

- **Przewodnik Architektury**: [🇵🇱 architecture.md](./architecture.md) | [🇺🇸 ../architecture.md](../architecture.md)
- **Standardy Kodowania**: [🇵🇱 coding-standards.md](./coding-standards.md) | [🇺🇸 ../coding-standards.md](../coding-standards.md)
- **Dokumentacja Aplikacji Next.js**: [🇵🇱 Aplikacja Next.js](../../next-app/README.md) (PL) | [🇺🇸 Next.js Application](../../next-app/README.md) (EN)
