import { TrainingGroup } from "@/club-preset/training-group";
import { Academy } from "@/club-preset/academy";
import { EventType, TournamentType } from "@/club-preset/event-type";
import { UserValidationConstants as USER } from "@/schemas/model/user/user-const";
import { GroupValidationConstants as GROUP } from "@/schemas/model/group/group-const";
import { EventValidationConstants as EVENT } from "@/schemas/model/event/event-const";
import { ChatMessageValidationConstants as CHAT_MESSAGE } from "@/schemas/model/chat-message/chat-message-const";
import { PartnershipPostValidationConstants as PARTNERSHIP_POST } from "@/schemas/model/partnership-post/partnership-post-const";
import { BiddingSystem } from "@/club-preset/partnership-post";

const MONTHS = {
  jan: "Styczeń",
  feb: "Luty",
  mar: "Marzec",
  apr: "Kwiecień",
  may: "Maj",
  jun: "Czerwiec",
  jul: "Lipiec",
  aug: "Sierpień",
  sep: "Wrzesień",
  oct: "Październik",
  nov: "Listopad",
  dec: "Grudzień",
};

const tabs = {
  dashboard: "Strona główna",
  calendar: "Kalendarz",
  groups: "Grupy",
  findPartner: "Szukaj partnera",
  tools: "Przydatne narzędzia",
};

const loginPage = {
  title: "Zaloguj się",
  noAccount: {
    text: "Nie masz jeszcze konta?",
    link: "Zarejestruj się",
  },
  form: {
    nicknameOrEmailField: {
      placeholder: "Nick lub email",
    },
    passwordField: {
      placeholder: "Hasło",
    },
  },
  utilities: {
    rememberMe: "Zapamiętaj mnie",
    forgotPassword: "Zapomniałeś hasła?",
  },
  submitButtons: {
    loginWithGoogle: "Zaloguj się z Google",
    login: "Zaloguj się",
  },
  toast: {
    loading: "Trwa logowanie...",
    success: "Pomyślnie zalogowano!",
    errorDefault: "Wystąpił błąd podczas logowania",
  },
};

const registerPage = {
  title: "Zarejestruj się",
  hasAccount: {
    text: "Masz już konto?",
    link: "Zaloguj się",
  },
  form: {
    firstNameField: {
      placeholder: "Imię",
    },
    lastNameField: {
      placeholder: "Nazwisko",
    },
    emailField: {
      placeholder: "E-mail",
    },
    passwordField: {
      placeholder: "Hasło",
    },
    repeatPasswordField: {
      placeholder: "Powtórz hasło",
    },
    nicknameField: {
      placeholder: "Nick lub przezwisko (opcjonalne)",
    },
  },
  utilities: {
    rememberMe: "Zapamiętaj mnie",
  },
  submitButtons: {
    registerWithGoogle: "Zarejestruj się z Google",
    register: "Zarejestruj się",
  },
  toast: {
    loading: "Tworzymy konto...",
    success: "Pomyślnie utworzono nowe konto!",
    errorDefault: "Wystąpił błąd podczas rejestracji",
  },
};

const onboardingPage = {
  common: {
    nextButton: "Dalej",
    prevButton: "Cofnij",
  },
  firstPage: {
    mainHeading: {
      text: "Najpierw... Opowiedz nam trochę o sobie!",
      highlight: "sobie",
    },
    subHeading: "Ważne dane personalne",
    academy: {
      placeholder: "Wybierz uczelnię",
    },
    yearOfBirth: {
      placeholder: "Wybierz rok urodzenia",
    },
  },
  secondPage: {
    mainHeading: {
      text: "Jesteś brydżowym weteranem? Może dopiero zaczynasz?",
      highlight: "weteranem",
    },
    subHeading: "Kilka rzeczy o Twoim doświadczeniu!",
    skillLevel: {
      placeholder: "Grupa zaawansowania, początkujący, trener?",
    },
    hasRefereeLicense: {
      label: "Czy skończyłeś kurs sędziowski?",
    },
    startPlayingDate: {
      placeholder: "Kiedy zacząłeś grać w brydża?",
    },
  },
  thirdPage: {
    mainHeading: {
      text: "Nadróbka dodatkowych informacji",
      highlight: "Nadróbka",
    },
    subHeading:
      "Profile brydżowe - ich widoczność dla innych możesz zmienić w ustawieniach",
    cezarId: {
      placeholder: "Numer Cezar (opcjonalne)",
    },
    bboId: {
      placeholder: "Nick na BBO (opcjonalne)",
    },
    cuebidsId: {
      placeholder: "Kod użytkownika na Cuebids (opcjonalne)",
    },
  },
  finalPage: {
    mainHeading: {
      text: "To już ostatnia lewa - czysta formalność!",
      highlight: "lewa",
    },
    subHeading:
      "Twoja pierwsza grupa - podaj kod aby mieć dostęp do społeczności Just Bridge AGH",
    submitButton: "Zakończ",
    terms: {
      acceptPrefix: "Akceptuję ",
      link: "regulamin i warunki użytkowania",
    },
    toast: {
      loading: "Przetwarzamy informacje...",
      success: "Super zakończyliśmy onboarding!",
      errorDefault:
        "Wystąpił błąd podczas dodawania informacji onboardingu. Spróbuj ponownie później.",
    },
  },
};

const dashboardPage = {
  headings: {
    lastTournaments: "Ostatnie turnieje",
    upcomingEvents: "Nadchodzące wydarzenia",
    partnersPlot: "Twoi partnerzy na przestrzeni czasu",
  },
  PZBSInfo: {
    nameAndLastName: "Imię i nazwisko",
    PIDCezar: "PID Cezar",
    WK: "WK",
    team: "Drużyna",
    region: "Okręg",
  },
};

const navbar = {
  tabs: tabs,
  menu: {
    profile: "Profil",
    settings: "Ustawienia",
    aboutPage: "O stronie",
    logout: "Wyloguj się",
    darkMode: "Tryb ciemny",
  },
  logoutToast: {
    loading: "Trwa wylogowywanie...",
    success: "Pomyślnie wylogowano!",
    error: "Wystąpił błąd podczas wylogowywania",
  },
};

const footer = {
  quickAccess: {
    title: "Szybki dostęp",
    content: tabs,
  },
  help: {
    title: "Pomoc",
    content: {
      privacyPolice: "Polityka prywatności",
      technicalHelp: "Pomoc techniczna",
    },
  },
  socialMedia: {
    title: "Społeczność",
  },
};

const landingPage = {
  logInButton: "Zaloguj się",
  landingPage1: {
    heading: "Jedyny portal w Polsce",
    text: "zapewniający wszystko, czego potrzebuje Twój klub brydżowy",
    highlight: "klub brydżowy",
    ariaLabel: "Tło strony startowej",
    callToActionButton: "Załóż konto teraz",
  },
  landingPage2: {
    heading: "Wszystko, czyli...?",
    text1:
      "Zaawansowany kalendarz, umożliwiający tworzenie takich wydarzeń, jak zjazdy ligowe, treningi, czy nawet spotkania towarzyskie!",
    highlight1: "Zaawansowany Kalendarz",
    text2:
      "System poszukiwania partnera w oparciu o charakterystykę zawodnika i system licytacji",
    highlight2: "System poszukiwania partnera",
    text3:
      "Możliwość tworzenia grup z miejscem na wspólne rozmowy, zapisywanie cennych rozdań czy materiałów szkoleniowych",
    highlight3: "Możliwość tworzenia grup",
  },
  landingPage3: {
    heading: "Brydżowe skrzyżowanie",
    text: "Wierzymy, że Bridge Crossroad to miejsce, w którym złączą się nasze drogi poza stołem brydżowym :)",
    highlight: "Bridge Crossroad",
  },
};

const groupsPage = {
  AddGroupModal: {
    header: "Dodaj grupę",
    form: {
      name: {
        placeholder: "Nazwa grupy",
      },
      description: {
        placeholder: "Opis grupy (opcjonalnie)",
      },
    },
    submitButton: "Utwórz",
    cancelButton: "Anuluj",
    toast: {
      loading: "Tworzenie grupy...",
      success: "Utworzono grupę!",
      errorDefault: "Wystąpił błąd podczas tworzenia grupy",
      errorNameExists: "Grupa o takiej nazwie już istnieje",
      errorInvalidData: "Nieprawidłowe dane. Sprawdź pola formularza",
      errorUnknown: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później",
    },
  },

  GroupsGrid: {
    noGroups: "Brak grup do wyświetlenia",
    menu: {
      open: "Otwórz",
      edit: "Edytuj",
      delete: "Usuń",
    },
    imageAlt: "obraz grupy",
  },

  Groups: {
    input: {
      invitationPlaceholder: "Wpisz kod grupy",
    },
    toast: {
      loading: "Dołączanie...",
      success: "Dołączono",
      errorDefault: "Wystąpił błąd podczas dołączania do grupy",
    },
    createButton: "Stwórz grupę",
    joinButton: "Dołącz",
  },

  UserTableRow: {
    placeholder: "-",
  },

  Sidebar: {
    back: "Wróć",
    nav: {
      about: "O grupie",
      chat: "Czat",
      materials: "Materiały",
      hands: "Rozdania",
    },
    members: {
      single: "1 członek",
      multiple: "{count} członków",
    },
  },

  PeopleList: {
    heading: "Członkowie Klubu",
    searchPlaceholder: "Szukaj po imieniu, nazwisku, nicku...",
    table: {
      name: "Imię i nazwisko",
      pzbs: "Numer PZBS",
      bbo: "Nickname na BBO",
      cuebids: "Kod zaproszenia na Cuebids",
    },
  },

  GroupView: {
    error: {
      loadFailed: "Nie udało się wczytać danych grupy.",
      stayInfo:
        "Pozostajesz na tej stronie — możesz spróbować ponownie lub wrócić do listy grup.",
    },
    buttons: {
      retry: "Spróbuj ponownie",
      backToList: "Wróć do grup",
    },
  },

  GroupBanner: {
    fallback: {
      name: "Brak nazwy",
      description: "Brak opisu",
    },
    admin: {
      title: "Administrator",
    },
    createdAt: {
      title: "Data założenia",
    },
    membersCount: {
      title: "Liczba członków",
      single: "1 członek",
      multiple: "{count} członków",
    },
    description: {
      title: "Opis grupy",
    },
  },
};

const calendarPage = {
  Sidebar: {
    addEvent: "Dodaj wydarzenie",
    seeMore: "Zobacz więcej",
  },
  showUpcomingEventsButton: "Zobacz nadchodzące wydarzenia",
};

const userModelValidation = {
  name: {
    firstName: {
      min: `Min. ${USER.name.min} znaki`,
      max: `Max. ${USER.name.max} znaków`,
      regex: "Tylko litery",
      required: "Podaj imię",
    },
    lastName: {
      min: `Min. ${USER.name.min} znaki`,
      max: `Max. ${USER.name.max} znaków`,
      regex: "Tylko litery",
      required: "Podaj nazwisko",
    },
  },
  onboarding: {
    academy: {
      invalid: "Nieprawidłowa uczelnia",
    },
    yearOfBirth: {
      min: `Rok urodzenia nie może być wcześniejszy niż ${USER.yearOfBirth.min}`,
      max: `Rok urodzenia nie może być późniejszy niż ${USER.yearOfBirth.max}`,
    },
    trainingGroup: {
      invalid: "Nieprawidłowa grupa treningowa",
    },
    cezarId: {
      regex: `Numer Cezar musi składać się z 1-6 cyfr`,
    },
    bboId: {
      invalid: "Niepoprawny nick na BBO",
      max: `Max. ${USER.platformIds.max} znaków`,
    },
    cuebidsId: {
      invalid: "Niepoprawny kod użytkownika na Cuebids",
      max: `Max. ${USER.platformIds.max} znaków`,
    },
  },
  email: {
    regex: "Podaj poprawny adres e-mail",
    max: `E-mail nie może być dłuższy niż ${USER.email.max} znaków`,
    required: "E-mail jest wymagany",
  },
  nickname: {
    min: `Nick musi mieć co najmniej ${USER.nickname.min} znaki`,
    max: `Nick nie może być dłuższy niż ${USER.nickname.max} znaków`,
    regex: "Nick może zawierać tylko litery, cyfry, _ i -",
  },
};

const groupModelValidation = {
  name: {
    required: "Podaj nazwę grupy",
    // fallback / server-side error message key
    server: "Wystąpił błąd związany z nazwą grupy",
    min: `Min. ${GROUP.name.min} znaki`,
    max: `Max. ${GROUP.name.max} znaków`,
    regex: "Nazwa może zawierać litery, cyfry, spacje, - i _",
  },
  description: {
    max: `Opis nie może być dłuższy niż ${GROUP.description.max} znaków`,
  },
  invitationCode: {
    length: `Kod zaproszenia musi składać się z ${GROUP.invitationCode.length} znaków`,
    regex: "Kod zaproszenia może zawierać tylko wielkie litery i cyfry",
  },
  imageUrl: {
    max: `URL obrazka nie może być dłuższy niż ${GROUP.imageUrl.max} znaków`,
    url: "Podaj poprawny adres URL",
  },
};

const eventModelValidation = {
  title: {
    required: "Podaj tytuł wydarzenia",
    min: `Min. ${EVENT.title.min} znaki`,
    max: `Max. ${EVENT.title.max} znaków`,
    regex: "Tytuł zawiera niedozwolone znaki",
  },
  description: {
    max: `Opis nie może być dłuższy niż ${EVENT.description.max} znaków`,
  },
  location: {
    max: `Lokalizacja nie może być dłuższa niż ${EVENT.location.max} znaków`,
  },
  imageUrl: {
    max: `URL obrazka nie może być dłuższy niż ${EVENT.imageUrl.max} znaków`,
    url: "Podaj poprawny adres URL",
  },
  duration: {
    invalidRange: "Data rozpoczęcia musi być wcześniejsza niż data zakończenia",
  },
  session: {
    duplicatePlayers: "Każdy zawodnik w sesji musi być unikalny",
  },
  data: {
    invalid: "Nieprawidłowe dane specyficzne dla typu wydarzenia",
  },
};

const chatMessageModelValidation = {
  message: {
    required: "Podaj wiadomość",
    min: `Min. ${CHAT_MESSAGE.message.min} znaki`,
    max: `Max. ${CHAT_MESSAGE.message.max} znaków`,
  },
};

const loginPageValidation = {
  nicknameOrEmail: {
    required: "Podaj nick lub email",
  },
  password: {
    required: "Podaj hasło",
  },
};

const registerPageValidation = {
  password: {
    required: "Podaj hasło",
    min: `Hasło musi mieć co najmniej ${USER.password.min} znaków`,
    max: `Hasło nie może być dłuższe niż ${USER.password.max} znaków`,
    noUpperCase: "Hasło musi zawierać wielkie litery",
    noLowerCase: "Hasło musi zawierać małe litery",
    noDigit: "Hasło musi zawierać cyfry",
    noSpecialChar: "Hasło musi zawierać znaki specjalne",
  },
  repeatPassword: {
    required: "Powtórz hasło",
    mismatch: "Hasła nie pasują do siebie",
  },
};

const onboardingPageValidation = {
  firstPage: {
    academy: {
      required: "Nie wybrano uczelni",
    },
    yearOfBirth: {
      required: "Nie wybrano roku urodzenia",
      invalid: "Nieprawidłowy rok urodzenia",
    },
  },
  secondPage: {
    startPlayingDate: {
      required: "Nie wybrano daty",
      invalid: "Nieprawidłowa data",
    },
    trainingGroup: {
      required: "Nie wybrano grupy zaawansowania",
    },
  },
  finalPage: {
    terms: {
      errorMessage: "Musisz zaakceptować regulamin i politykę prywatności",
    },
  },
};

const eventForm = {
  buttons: {
    prev: "Cofnij",
    next: "Dalej",
    submit: "Dodaj wydarzenie",
  },
  toast: {
    loading: "Trwa dodawanie wydarzenia...",
    success: "Wydarzenie zostało dodane!",
    errorDefault: "Wystąpił błąd podczas dodawania wydarzenia",
  },
  steps: {
    primary: "Podstawowe informacje",
    detailed: "Szczegóły wydarzenia",
    summary: "Podsumowanie",
  },
  primaryInfoStep: {
    titlePlaceholder: "Tytuł wydarzenia",
    descriptionPlaceholder: "Opis wydarzenia",
    groupPlaceholder: "Wybierz grupę",
    organizerPlaceholder: "Wybierz organizatora",
    eventStartPlaceholder: "Początek wydarzenia",
    eventEndPlaceholder: "Koniec wydarzenia",
    eventTypePlaceholder: "Typ wydarzenia",
  },
  detailedInfoStep: {
    trainingPanel: {
      coachPlaceholder: "Wybierz trenera",
      topicPlaceholder: "Temat treningu",
    },
    tournamentPanel: {
      tournamentTypePlaceholder: "Wybierz typ turnieju",
      arbiterPlaceholder: "Wybierz sędziego",
    },
    sessionEditor: {
      addSessionButton: "Dodaj sesję",
      firstPairLabel: "Pierwsza para",
      secondPairLabel: "Druga para",
      firstPlayerPlaceholder: "Pierwszy zawodnik",
      secondPlayerPlaceholder: "Drugi zawodnik",
      opponentTeamNamePlaceholder: "Nazwa zespołu przeciwnika (opcjonalne)",
      matchNumberPlaceholder: "Numer meczu: ",
    },
  },
  summaryStep: {
    title: "Tytuł wydarzenia:",
    description: "Opis wydarzenia:",
    group: "Grupa:",
    organizer: "Organizator:",
    eventStart: "Początek wydarzenia:",
    eventEnd: "Koniec wydarzenia:",
    eventType: "Typ wydarzenia:",
    tournament: {
      type: "Typ turnieju:",
      arbiter: "Sędzia:",
    },
    leagueMeeting: {
      totalRounds: "Ilość sesji:",
      sessionName: "Sesja ",
      firstPlayer: "Pierwszy zawodnik:",
      secondPlayer: "Drugi zawodnik:",
      opponentTeamName: "Nazwa zespołu przeciwnika:",
    },
    training: {
      coach: "Trener:",
      topic: "Temat treningu:",
    },
    additionalDescription: "Dodatkowy opis:",
  },
};

const usefulTools = {
  title: "Przydatne narzędzia",
  buttonText: "Zobacz więcej",
  tools: {
    bridgeBase: {
      title: "Bridge Base Online",
      description:
        "Najbardziej popularna platforma do gry w brydża umożliwiająca szeroki wachlarz ćwiczeń, wspólną grę ze znajomymi i branie udziału w turniejach online.",
    },
    rpBridge: {
      title: "RP Bridge",
      description:
        "Niech nie zmyli Cię prosty wygląd. Ta strona zawiera naprawdę dużo narzędzi do ćwiczenia gry w brydża. Od profesjonalnych, aż po humorystyczne 🙂",
    },
    simonsConventions: {
      title: "Simon's Conventions",
      description: "Rozbudowana baza konwencji licytacyjnych bez kompromisów.",
    },
    cuebids: {
      title: "Cuebids",
      description:
        "Nowoczesna aplikacja do ćwiczenia licytacji i porównywania się z botami o różnych stopniach zaawansowania.",
    },
  },
};

const chatPage = {
  sendMessagePlaceholder: "Napisz wiadomość...",
  header: {
    title: "Czat grupowy",
  },
  loadMore: "Załaduj więcej",
  noMessages: "Brak wiadomości",
  error: {
    loadFailed: "Nie udało się załadować wiadomości",
  },
};

const findPartnerPage = {
  PartnershipForm: {
    addButton: "Dodaj ogłoszenie",
    modalHeader: "Ogłoszenie poszukiwania partnera",
    nameLabel: "Nazwa",
    descriptionLabel: "Opis",
    biddingSystemLabel: "System licytacji",
    typeLabel: "Typ ogłoszenia",
    single: "Jednorazowe",
    period: "Okresowe",
    eventIdLabel: "Wybierz powiązane wydarzenie",
    eventPlaceholder: "-- Wybierz wydarzenie --",
    exampleEvents: {
      "691b834873fb688327d065b6": "Odległa przyszłość",
      "some-other-event-id": "Przykładowe wydarzenie",
    },
    startsAtLabel: "Data rozpoczęcia",
    endsAtLabel: "Data zakończenia",
    cancelButton: "Anuluj",
    createButton: "Utwórz (placeholder)",
    toast: {
      success: "Ogłoszenie utworzone (placeholder)",
      error: "Błąd podczas tworzenia (placeholder)",
    },
  },
};

const messages = {
  common: {
    date: {
      months: MONTHS,
    },
    academy: {
      [Academy.UJ]: "Uniwersytet Jagielloński",
      [Academy.AGH]: "Akademia Górniczo-Hutnicza",
      [Academy.PK]: "Politechnika Krakowska",
      [Academy.UEK]: "Uniwersytet Ekonomiczny w Krakowie",
      [Academy.UP]: "Uniwersytet Pedagogiczny w Krakowie",
      [Academy.UR]: "Uniwersytet Rolniczy w Krakowie",
      [Academy.ASP]: "Akademia Sztuk Pięknych w Krakowie",
      [Academy.AM]: "Akademia Muzyczna w Krakowie",
      [Academy.AWF]: "Akademia Wychowania Fizycznego w Krakowie",
      [Academy.UPJPII]: "Uniwersytet Papieski Jana Pawła II w Krakowie",
      [Academy.IGNATIANUM]: "Ignatianum - Akademia Ignatianum w Krakowie",
      [Academy.INNA]: "inna uczelnia",
    },
    trainingGroup: {
      [TrainingGroup.BASIC]: "Podstawowa",
      [TrainingGroup.INTERMEDIATE]: "Średniozaawansowana",
      [TrainingGroup.ADVANCED]: "Zaawansowana",
      [TrainingGroup.COACH]: "Jestem trenerem!",
      [TrainingGroup.NONE]: "Nie chodzę na zajęcia z brydża na AGH",
    },
    eventType: {
      [EventType.LEAGUE_MEETING]: "Zjazd ligowy",
      [EventType.TOURNAMENT_TEAMS]: "Turniej drużynowy",
      [EventType.TOURNAMENT_PAIRS]: "Turniej",
      [EventType.TRAINING]: "Trening",
      [EventType.OTHER]: "Inne",
    },
    tournamentType: {
      [TournamentType.MAX]: "MAXy",
      [TournamentType.IMPS]: "IMPy",
      [TournamentType.CRAZY]: "Crazy",
      [TournamentType.BAMY]: "BAMY",
    },
    biddingSystem: {
      [BiddingSystem.ZONE]: "Strefa",
      [BiddingSystem.COMMON_LANGUAGE]: "Wspólny język",
      [BiddingSystem.DOUBLETON]: "Dubeltówka",
      [BiddingSystem.SAYC]: "SAYC",
      [BiddingSystem.BETTER_MINOR]: "Lepszy Młodszy",
      [BiddingSystem.WEAK_OPENINGS_SSO]: "SSO",
      [BiddingSystem.TOTOLOTEK]: "Totolotek",
      [BiddingSystem.NATURAL]: "Naturalny",
      [BiddingSystem.OTHER]: "Inny",
    },
    error: {
      messageKeyNotExisting: "Wystąpił błąd",
      serverError: "Wystąpił błąd. Spróbuj ponownie później.",
      validationError: "Wystąpił błąd walidacji. Sprawdź wprowadzone dane.",
      networkError: "Wystąpił błąd sieci. Sprawdź połączenie internetowe.",
      unknownError: "Wystąpił błąd. Spróbuj ponownie później.",
    },
    errorTemplate: {
      serverError: "Wystąpił błąd przy pobieraniu {template}.",
      validationError:
        "Wystąpił błąd walidacji danych przy pobieraniu {template}.",
      networkError:
        "Wystąpił błąd sieci przy pobieraniu {template}. Sprawdź połączenie internetowe.",
      unknownError:
        "Wystąpił błąd przy pobieraniu {template}. Spróbuj ponownie później.",
    },
  },
  validation: {
    model: {
      user: userModelValidation,
      group: groupModelValidation,
      event: eventModelValidation,
      chatMessage: chatMessageModelValidation,
      partnershipPost: {
        name: {
          min: `Min. ${PARTNERSHIP_POST.name.min} znaki`,
          max: `Max. ${PARTNERSHIP_POST.name.max} znaków`,
        },
        description: {
          max: `Opis nie może być dłuższy niż ${PARTNERSHIP_POST.description.max} znaków`,
        },
      },
    },
    pages: {
      auth: {
        login: loginPageValidation,
        register: registerPageValidation,
      },
      onboarding: onboardingPageValidation,
    },
  },
  api: {
    auth: {
      register: {
        emailExists: "Konto z tym adresem e-mail już istnieje",
        nicknameExists: "Konto z tym nickiem już istnieje",
      },
      login: {
        invalidCredentials: "Nieprawidłowe dane logowania",
      },
    },
    onboarding: {
      finalPage: {
        inviteCode: {
          invalid: "Nieprawidłowy kod zaproszenia do Just Bridge AGH",
        },
      },
    },
    groups: {
      create: {
        nameExists: "Grupa o takiej nazwie już istnieje",
        unknown: "Wystąpił błąd podczas tworzenia grupy",
      },
      join: {
        alreadyMember: "Jesteś już członkiem tej grupy",
        invalidInvitationCode: "Nieprawidłowy kod zaproszenia",
      },
    },
  },
  pages: {
    Auth: {
      LoginPage: loginPage,
      RegisterPage: registerPage,
    },
    OnboardingPage: onboardingPage,
    DashboardPage: dashboardPage,
    LandingPage: landingPage,
    EventPage: {
      page: {
        backLink: "Wróć do kalendarza",
        toast: {
          loadError: {
            title: "Nie udało się wczytać wydarzenia",
            description:
              "Spróbuj ponownie później i upewnij się, że wydarzenie istnieje.",
          },
        },
      },
    },
    UsefulTools: usefulTools,
    GroupsPage: groupsPage,
    ChatPage: chatPage,
    CalendarPage: calendarPage,
    EventFormPage: eventForm,
    FindPartnerPage: findPartnerPage,
  },
  components: {
    Navbar: navbar,
    Footer: footer,
    BackLink: {
      fallbackText: "Wróć",
    },
    SidebarCard: {
      detailsButtonText: "Szczegóły",
    },
    EventPage: {
      EventDetails: {
        organizer: "Organizator",
        participants: "Uczestnicy",
        noParticipants: "Brak uczestników",
      },
      EventEnrollment: {
        heading: "Zapisy",
        placeholder: {
          playerA: "Gracz A (id lub nick)",
          playerB: "Gracz B (id lub nick)",
        },
        button: {
          tournament: "Zapisz się na turniej",
          event: "Zapisz się na wydarzenie",
        },
      },
      EventSpecificData: {
        tournamentHeading: "Dane turnieju",
        leagueHeading: "Dane zjazdu ligowego",
        trainingHeading: "Dane treningu",
        labels: {
          type: "Typ:",
          arbiter: "Sędzia:",
          coach: "Trener:",
          topic: "Temat:",
        },
        noCoach: "Brak trenera",
        noAdditionalData: "Brak dodatkowych danych",
        pairs: "Pary",
        half: {
          first: "Pierwsza",
          second: "Druga",
        },
        league: {
          table: {
            match: "Mecz",
            half: "Połowa",
            pair1: "Para 1",
            pair2: "Para 2",
            opponent: "Przeciwnik",
          },
        },
      },
    },
  },
};

export default messages;

// This type is used to ensure that the messages object matches the expected structure
// pl version is the main version
export type IAppMessagesForLanguage = typeof messages;
