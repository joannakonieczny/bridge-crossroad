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

const forgotPasswordPage = {
  title: "Resetuj hasło",
  backToLogin: {
    text: "Pamiętasz hasło?",
    link: "Wróć do logowania",
  },
  form: {
    emailField: {
      placeholder: "Adres e-mail",
    },
  },
  emailSentInfo: {
    message: "Nowe hasło zostało wysłane na podany adres e-mail!",
    instructions:
      "Sprawdź swoją skrzynkę pocztową, użyj otrzymanego hasła do zalogowania, a następnie zmień je w ustawieniach konta.",
  },
  submitButtons: {
    sendEmail: "Wyślij nowe hasło",
    resendEmail: "Wyślij ponownie",
  },
  toast: {
    loading: "Resetowanie hasła...",
    success: "Nowe hasło zostało wysłane na Twój adres e-mail!",
    resendSuccess: "Nowe hasło zostało wysłane ponownie!",
    errorDefault: "Wystąpił błąd podczas wysyłania emaila",
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
  AddModifyGroupModal: {
    create: {
      header: "Dodaj nową grupę",
      toast: {
        loading: "Tworzenie grupy...",
        success: "Utworzono grupę!",
        errorDefault: "Wystąpił błąd podczas tworzenia grupy",
      },
      submitButton: "Utwórz",
    },
    modify: {
      header: "Zmodyfikuj dane grupy",
      toast: {
        loading: "Modyfikowanie danych grupy...",
        success: "Zmieniono dane grupy!",
        errorDefault: "Wystąpił błąd podczas modyfikowania danych grupy",
      },
      submitButton: "Zmodyfikuj",
    },
    form: {
      name: {
        placeholder: "Nazwa grupy",
      },
      description: {
        placeholder: "Opis grupy (opcjonalnie)",
      },
      image: {
        label: "Zdjęcie grupy (opcjonalnie)",
        additionalLabel:
          "Pamiętaj, że zawsze możesz je później zmienić na stronie grupy.",
        placeholder: "Wybierz zdjęcie dla twojej grupy",
        errorUpload:
          "Nie udało się przesłać zdjęcia, spróbuj ponownie lub usuń je.",
      },
    },
    imageToast: {
      loading: "Przesyłanie zdjęcia...",
      success: "Zdjęcie zostało przesłane!",
      error: "Nie udało się przesłać zdjęcia",
    },
  },

  GroupsGrid: {
    noGroups: "Brak grup do wyświetlenia",
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
      files: "Materiały",
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
    toast: {
      success: "Kod dołączenia skopiowany do schowka",
      loading: "Kopiowanie...",
      error: "Nie udało się skopiować kodu dołączenia",
    },
    adminBox: {
      heading: "Kod dołączenia",
      copyButton: "Kopiuj",
    },
  },

  GroupFiles: {
    filter: {
      label: "Filtr:",
      options: {
        images: "Zdjęcia",
        otherFiles: "Inne pliki",
      },
      refreshButton: "Odśwież",
    },
    sections: {
      images: {
        loadMore: "Załaduj więcej zdjęć",
        noFiles: "Na tej grupie nie wysłano jeszcze żadnych zdjęć.",
      },
      otherFiles: {
        loadMore: "Załaduj więcej plików",
        noFiles: "Na tej grupie nie wysłano jeszcze żadnych plików.",
        downloadButton: "Pobierz",
      },
    },
    error: {
      loadFailed: "Nie udało się załadować materiałów.",
    },
  },

  GroupBanner: {
    fallback: {
      name: "Brak nazwy",
      description: "Brak opisu",
    },
    admin: {
      title: "Administratorzy:",
      menu: {
        editGroup: "Edytuj grupę",
        addAdmin: "Dodaj administratora",
        removeAdmin: "Usuń administratora",
      },
      menuLabel: "Narzędzia administratora",
    },
    createdAt: {
      title: "Data założenia:",
    },
    membersCount: {
      title: "Liczba członków:",
      single: "1 członek",
      multiple: "{count} członków",
    },
    description: {
      title: "Opis grupy",
    },
  },

  AddRemoveAdminModal: {
    add: {
      header: "Dodaj nowego administratora",
      toast: {
        loading: "Dodawanie administratora...",
        success: "Administrator został dodany!",
        errorDefault: "Wystąpił błąd podczas dodawania administratora",
      },
      submitButton: "Dodaj",
    },
    remove: {
      header: "Usuń istniejącego administratora",
      toast: {
        loading: "Usuwanie administratora...",
        success: "Użytkownik został usunięty jako administrator!",
        errorDefault: "Wystąpił błąd podczas usuwania administratora",
      },
      submitButton: "Usuń",
    },
    form: {
      userSelect: {
        placeholder: "Wybierz użytkownika",
        required: "Wybierz użytkownika z grupy",
      },
    },
  },
};

const calendarPage = {
  Sidebar: {
    addEvent: "Dodaj wydarzenie",
  },
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
  playingPair: {
    firstSecondDistinct: "Obaj zawodnicy pary muszą być różni",
  },
  session: {
    duplicatePlayers: "Każdy zawodnik w sesji musi być unikalny",
  },
  data: {
    invalid: "Nieprawidłowe dane specyficzne dla typu wydarzenia",
    type: {
      unsupportedTournamentType: "Nieobsługiwany typ turnieju",
      pair: {
        required: "Podaj parę turniejową",
        userNotInPair: "Musisz być jednym z zawodników w podanej parze",
        duplicatePlayers: "Obaj zawodnicy pary muszą być różni",
        alreadyInAnotherPair:
          "Jeden lub więcej zawodników jest już zapisany w innej parze",
        partnerId: {
          required: "Wybierz partnera do pary",
        },
      },
      team: {
        required: "Podaj drużynę",
        teamNameTaken: "Nazwa drużyny jest już zajęta",
        userNotInTeam: "Musisz być członkiem tej drużyny",
      },
    },
  },
  additionalDescription: {
    max: `Dodatkowy opis nie może być dłuższy niż ${EVENT.additionalDescription.max} znaków`,
  },
  team: {
    name: {
      min: `Min. ${EVENT.team.name.min} znaki`,
      max: `Max. ${EVENT.team.name.max} znaków`,
      required: "Podaj nazwę drużyny",
    },
    members: {
      min: `Min. ${EVENT.team.members.min} członków`,
      unique: "Członkowie drużyny muszą być unikalni",
    },
  },
  leagueMeeting: {
    opponentTeamName: {
      max: `Nazwa zespołu przeciwnika nie może być dłuższa niż ${EVENT.opponentTeamName.max} znaków`,
    },
  },
  training: {
    topic: {
      required: "Podaj temat treningu",
      min: `Min. ${EVENT.trainingTopic.min} znaki`,
      max: `Max. ${EVENT.trainingTopic.max} znaków`,
    },
  },
  tournamentTeam: {
    name: {
      required: "Podaj nazwę zespołu",
      min: `Min. ${EVENT.team.name.min} znaki`,
      max: `Max. ${EVENT.team.name.max} znaków`,
    },
  },
  group: {
    required: "Wybierz grupę, do której należy wydarzenie",
  },
  organizer: {
    required: "Wybierz organizatora",
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
  create: {
    toast: {
      loading: "Trwa dodawanie wydarzenia...",
      success: "Wydarzenie zostało dodane!",
      errorDefault: "Wystąpił błąd podczas dodawania wydarzenia",
    },
    header: "Dodaj wydarzenie",
    submitButton: "Dodaj wydarzenie",
  },
  modify: {
    toast: {
      loading: "Trwa modyfikowanie wydarzenia...",
      success: "Wydarzenie zostało zmodyfikowane!",
      errorDefault: "Wystąpił błąd podczas modyfikowania wydarzenia",
    },
    header: "Modyfikuj wydarzenie",
    submitButton: "Zapisz zmiany",
  },
  buttons: {
    prev: "Cofnij",
    next: "Dalej",
  },
  imageToast: {
    loading: "Przesyłanie zdjęcia...",
    success: "Zdjęcie zostało przesłane!",
    error: "Nie udało się przesłać zdjęcia",
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
    groupWarning: {
      selectGroup: "Pamiętaj o wybraniu grupy do której należy wydarzenie!",
      organizerNote: "Bez tego nie możemy dodać organizatora.",
    },
    image: {
      label: "Zdjęcie wydarzenia (opcjonalnie)",
      additionalLabel: "Pamiętaj, że zawsze możesz je później zmienić.",
      placeholder: "Wybierz zdjęcie dla wydarzenia",
      errorUpload:
        "Nie udało się przesłać zdjęcia, spróbuj ponownie lub usuń je.",
    },
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
      tooFewPeopleInGroupWarning:
        "W grupie jest mniej niż 4 zawodników — nie można dodać sesji",
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
  loadMore: "Załaduj więcej",
  noMessages: "Brak wiadomości",
  editButton: "Edytuj",
  error: {
    loadFailed: "Nie udało się załadować wiadomości",
  },
  attachFileModal: {
    header: "Dołącz plik",
    fileErrorUpload:
      "Nie udało się przesłać pliku, spróbuj ponownie lub usuń go aby wysłać samą wiadomość.",
    submitButton: "Wyślij",
  },
  fileUploadToast: {
    loading: "Przesyłanie pliku...",
    success: "Plik przesłany",
    error: "Błąd przesyłania pliku",
  },
  sendMessageToast: {
    loading: "Wysyłanie wiadomości...",
    success: "Wiadomość wysłana",
    errorDefault: "Nie udało się wysłać wiadomości",
  },
  editMessageToast: {
    loading: "Aktualizowanie wiadomości...",
    success: "Wiadomość zaktualizowana",
    errorDefault: "Nie udało się zaktualizować wiadomości",
  },
  editMode: {
    title: "Edycja wiadomości",
    cancel: "Anuluj",
  },
};

const findPartner = {
  PartnershipForm: {
    addButton: "Dodaj ogłoszenie",
    modalHeader: "Nowe ogłoszenie poszukiwania partnera",
    groupLabel: "Grupa",
    groupPlaceholder: "Wybierz grupę",
    nameLabel: "Nazwa",
    descriptionLabel: "Opis",
    biddingSystemLabel: "System licytacji",
    typeLabel: "Typ ogłoszenia",
    single: "Jednorazowe",
    period: "Okresowe",
    timeWindowStartLabel: "Wyświetl wydarzenia od",
    timeWindowEndLabel: "Wyświetl wydarzenia do",
    eventIdLabel: "Wybierz powiązane wydarzenie",
    eventPlaceholder: "-- Wybierz wydarzenie --",
    startsAtLabel: "Od",
    endsAtLabel: "Do",
    createButton: "Utwórz ogłoszenie",
    toast: {
      loading: "Tworzenie ogłoszenia...",
      success: "Ogłoszenie utworzone",
      error: "Błąd podczas tworzenia",
      frequency: {
        SINGLE: "Pojedyncza",
        PERIOD: "Okresowa",
      },
    },
  },
  Announcement: {
    toast: {
      add: {
        success:
          "Zapisano na zgłoszenie - zostaniesz powiadomiony, jeśli zgłoszeniodawca zatwierdzi chęć wspólnej gry.",
        error: "Błąd podczas zapisywania",
        loading: "Zapisywanie...",
      },
      remove: {
        success: "Wypisano z zgłoszenia",
        error: "Błąd podczas wypisywania",
        loading: "Wypisywanie...",
      },
    },
    frequency: {
      SINGLE: "Pojedyncza",
      PERIOD: "Okresowa",
    },
    ui: {
      noDescription: "Brak opisu",
      button: {
        cancel: "Anuluj",
        interested: "Jestem zainteresowany",
        save: "Zapisz",
      },
      loading: {
        saving: "Zapisywanie...",
        unregistering: "Wypisywanie...",
      },
      select: {
        playWith: "Zagram z...",
        noInterested: "Brak zainteresowanych",
      },
    },
  },
  List: {
    tableHeaders: {
      name: "Nazwa",
      player: "Zawodnik",
      frequency: "Częstotliwość",
      preferredSystem: "Preferowany system",
    },
    skeleton: {
      noInterestedPlaceholder: "Brak zainteresowanych",
    },
  },
  FiltersBar: {
    activity: {
      active: "Aktywne",
      inactive: "Nieaktywne",
    },
    placeholders: {
      group: "Grupa",
      frequency: "Częstotliwość",
      experience: "Doświadczenie",
      trainingGroup: "Grupa treningowa",
      biddingSystem: "System licytacyjny",
    },
    allGroups: "Wszystkie grupy",
    scopeOptions: {
      all: "Wszystkie",
      mine: "Moje",
    },
    frequencyOptions: {
      any: "Dowolna",
      SINGLE: "Pojedyncza",
      PERIOD: "Okresowa",
    },
    experienceOptions: {
      any: "Dowolne",
      "<1": "mniej niż rok",
      "1": "1 rok",
      "2": "2 lata",
      "3": "3 lata",
      "4": "4 lata",
      "5+": "5+ lat",
      "10+": "10+ lat",
      "15+": "15+ lat",
    },
    button: {
      clear: "Wyczyść",
      filtersLabel: "Filtry",
    },
  },
  MainBar: {
    searchPlaceholder: "Szukaj oferty, turnieju, partnera...",
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
      [BiddingSystem.COMMON_LANGUAGE]: "Wspólny Język",
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
          required: "Podaj nazwę ogłoszenia",
          min: `Min. ${PARTNERSHIP_POST.name.min} znaki`,
          max: `Max. ${PARTNERSHIP_POST.name.max} znaków`,
        },
        description: {
          max: `Opis nie może być dłuższy niż ${PARTNERSHIP_POST.description.max} znaków`,
        },
        status: {
          cannotChangeExpired:
            "Nie można zmienić statusu wygasłego ogłoszenia na inny niż EXPIRED",
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
    common: {
      duration: {
        invalid: "Data zakończenia musi być późniejsza niż data rozpoczęcia",
      },
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
      resetPassword: {
        userNotFound: "Nie znaleziono użytkownika z podanym adresem e-mail",
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
      admin: {
        demote: {
          lastAdminError:
            "Nie można usunąć ostatniego administratora grupy. Musisz najpierw dodać innego administratora.",
        },
      },
    },
  },
  pages: {
    Auth: {
      LoginPage: loginPage,
      RegisterPage: registerPage,
      ForgotPasswordPage: forgotPasswordPage,
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
      modifyButton: "Zmodyfikuj dane o wydarzeniu",
      EventEnrollment: {
        heading: "Zapis na wydarzenie",
        participantsCount: {
          many: "Liczba uczestników: {count}",
          none: "Brak uczestników",
        },
        enroll: {
          toast: {
            loading: "Zapisywanie...",
            success: "Zapisano na wydarzenie!",
            errorDefault: "Wystąpił błąd podczas zapisywania na wydarzenie",
          },
          button: "Zapisz się",
        },
        unenroll: {
          toast: {
            loading: "Wypisywanie...",
            success: "Wypisano z wydarzenia!",
            errorDefault: "Wystąpił błąd podczas wypisywania z wydarzenia",
          },
          button: "Wypisz się",
        },
      },
      EventPairsTournamentEnrollment: {
        heading: "Zapisy na turniej",
        selectPartner: {
          placeholder: "Wybierz partnera",
        },
        button: "Zapisz na turniej",
        toast: {
          loading: "Zapisywanie na turniej...",
          success: "Zapisano na turniej!",
          errorDefault: "Wystąpił błąd podczas zapisywania na turniej",
        },
        alreadyEnrolled: "Jesteś już zapisany na ten turniej z:",
        unenrollButton: "Wypisz się z turnieju",
        confirmationModal: {
          title: "Potwierdzenie wypisania z turnieju",
          message: {
            main: "Wypisując się z turnieju, rezygnujesz z udziału w grze wraz ze swoim partnerem.",
            info: "Oboje nadal będziecie widoczni jako uczestnicy wydarzenia, ale nie będziecie brać udziału w grze.",
            regret:
              "Jeśli zmienisz zdanie, zawsze możesz ponownie się zapisać, o ile turniej na to pozwala.",
          },
          confirm: "Wypisz się",
          cancel: "Anuluj",
        },
        unenrollToast: {
          loading: "Wypisywanie z turnieju...",
          success: "Wypisano z turnieju!",
          errorDefault: "Wystąpił błąd podczas wypisywania z turnieju",
        },
      },
      EventTeamsTournamentEnrollment: {
        heading: "Zapisy drużynowe na turniej",
        teamName: {
          placeholder: "Nazwa drużyny",
        },
        selectMembers: {
          placeholder: "Wybierz członków drużyny",
        },
        button: "Zapisz drużynę na turniej",
        toast: {
          loading: "Zapisywanie drużyny na turniej...",
          success: "Zapisano drużynę na turniej!",
          errorDefault: "Wystąpił błąd podczas zapisywania drużyny na turniej",
        },
        alreadyEnrolled: "Jesteś już zapisany w drużynie:",
        teamMembers: "Członkowie drużyny:",
        mustBeInTeam: "Musisz być członkiem swojej drużyny",
        unenrollButton: "Wypisz drużynę z turnieju",
        confirmationModal: {
          title: "Potwierdzenie wypisania drużyny z turnieju",
          message: {
            main: "Wypisując drużynę z turnieju, rezygnujecie z udziału w grze wszyscy członkowie drużyny.",
            info: "Nadal będziecie widoczni jako uczestnicy wydarzenia, ale nie będziecie brać udziału w grze.",
            regret: "Czy na pewno chcesz wypisać drużynę?",
          },
          confirm: "Wypisz drużynę",
          cancel: "Anuluj",
        },
        unenrollToast: {
          loading: "Wypisywanie drużyny z turnieju...",
          success: "Wypisano drużynę z turnieju!",
          errorDefault: "Wystąpił błąd podczas wypisywania drużyny z turnieju",
        },
      },
    },
    UsefulTools: usefulTools,
    GroupsPage: groupsPage,
    ChatPage: chatPage,
    CalendarPage: calendarPage,
    EventFormPage: eventForm,
    FindPartner: findPartner,
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
    FileUploader: {
      placeholder: "Wybierz plik",
      errorUpload: "Nie udało się zapisać pliku, spróbuj ponownie później",
      formats: "Akceptowane formaty",
      maxSize: "Maksymalny rozmiar",
      errorInvalidType: "Niedozwolony typ pliku",
      errorFileTooBig: "Plik jest za duży. Maksymalny rozmiar",
      errorReadingFile: "Wystąpił błąd podczas odczytu pliku",
    },
    EventPage: {
      EventDetails: {
        organizer: "Organizator",
        participants: "Uczestnicy",
        noParticipants: "Brak uczestników",
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
        teams: "Drużyny",
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
