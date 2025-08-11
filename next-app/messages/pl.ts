import { TrainingGroup } from "@/club-preset/training-group";
import { Academy } from "@/club-preset/academy";
import { UserValidationConstants as USER } from "@/schemas/model/user/user-const";

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

const tooLongString = "Max. {maxLength} znaków";

const authForm = {
  nicknameField: {
    placeholder: "Nick lub przezwisko (opcjonalne)",
    errorMessage: "Podaj poprawny nick",
  },
  passwordField: {
    placeholder: "Hasło",
    errorMessage: "Podaj poprawne hasło",
    minLength: "Hasło musi mieć co najmniej {minLength} znaków",
    maxLength: "Hasło nie może być dłuższe niż {maxLength} znaków",
    invalidSyntax:
      "Hasło musi zawierać wielkie, małe litery, cyfry i znaki specjalne",
    noLowerCase: "Hasło musi zawierać małe litery",
    noUpperCase: "Hasło musi zawierać wielkie litery",
    noDigit: "Hasło musi zawierać cyfry",
    noSpecialChar: "Hasło musi zawierać znaki specjalne",
    required: "Podaj hasło",
  },
  emailField: {
    placeholder: "E-mail",
    errorMessage: "Podaj poprawny adres e-mail",
  },
  firstNameField: {
    placeholder: "Imię",
    errorMessage: "Podaj poprawne imię",
  },
  lastNameField: {
    placeholder: "Nazwisko",
    errorMessage: "Podaj poprawne nazwisko",
  },
  repeatPasswordField: {
    placeholder: "Powtórz hasło",
    errorMessage: "Hasła nie pasują do siebie",
  },
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
      errorMessage: "Podaj poprawny nick lub email",
      required: "Podaj nick lub email",
    },
    passwordField: authForm.passwordField,
  },
  utilities: {
    rememberMe: "Zapamiętaj mnie",
    forgotPassword: "Zapomniałeś hasła?",
  },
  submitButtons: {
    loginWithGoogle: "Zaloguj się z Google",
    login: "Zaloguj się",
  },
  errors: {
    invalidCredentials: "Nieprawidłowe dane logowania",
  },
};

const registerPage = {
  title: "Zarejestruj się",
  hasAccount: {
    text: "Masz już konto?",
    link: "Zaloguj się",
  },
  form: {
    firstNameField: authForm.firstNameField,
    lastNameField: authForm.lastNameField,
    emailField: authForm.emailField,
    passwordField: authForm.passwordField,
    repeatPasswordField: authForm.repeatPasswordField,
    nicknameField: authForm.nicknameField,
  },
  utilities: {
    rememberMe: "Zapamiętaj mnie",
  },
  submitButtons: {
    registerWithGoogle: "Zarejestruj się z Google",
    register: "Zarejestruj się",
  },
  errors: {
    emailExists: "Konto z tym adresem e-mail już istnieje",
    nicknameExists: "Konto z tym nickiem już istnieje",
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
      required: "Nie wybrano uczelni",
    },
    yearOfBirth: {
      placeholder: "Wybierz rok urodzenia",
      required: "Nie wybrano roku urodzenia",
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
      required: "Nie wybrano grupy zaawansowania",
    },
    hasRefereeLicense: {
      label: "Czy skończyłeś kurs sędziowski?",
    },
    startPlayingDate: {
      placeholder: "Kiedy zacząłeś grać w brydża?",
      required: "Nie wybrano daty",
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
      maxLenght: tooLongString,
    },
    bboId: {
      placeholder: "Nick na BBO (opcjonalne)",
      maxLenght: tooLongString,
    },
    cuebidsId: {
      placeholder: "Kod użytkownika na Cuebids (opcjonalne)",
      maxLenght: tooLongString,
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
    inviteCode: {
      regex: "Podaj poprawny kod zaproszenia",
      required: "Nie podano kodu zaproszenia",
    },
    terms: {
      acceptPrefix: "Akceptuję ",
      link: "regulamin i warunki użytkowania",
      errorMessage: "Musisz zaakceptować regulamin i politykę prywatności",
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
  Tabs: {
    dashboard: "Strona główna",
    calendar: "Kalendarz",
    groups: "Grupy",
    findPartner: "Szukaj partnera",
    tools: "Przydatne narzędzia",
  },
};

const landingPage = {
  logInButton: "Zaloguj się",
};

const userModelValidation = {
  name: {
    firstName: {
      min: `Min. ${USER.name.min} znaki`,
      max: "Max. {max} znaków",
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
      regexLenght: `Numer Cezar musi składać się z ${USER.cezarId.length} cyfr`,
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
    inviteCode: {
      required: "Nie podano kodu zaproszenia",
      regex: "Podaj poprawny kod zaproszenia",
    },
    terms: {
      errorMessage: "Musisz zaakceptować regulamin i politykę prywatności",
    },
  },
};

const messages = {
  DummyPage: {
    text: "Witaj świecie!",
    description: {
      text: "To jest przykładowy tekst na stronie DummyPage.",
      text2: "To jest drugi przykładowy tekst na stronie DummyPage.",
    },
  },
  common: {
    appName: "Bridge Crossroad",
    appNameWords: {
      first: "Bridge",
      second: "Crossroad",
    },
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
    error: {
      general: "Wystąpił błąd dla {error}. Spróbuj ponownie później.",
      messageKeyNonExisting: "Wystąpił błąd",
    },
  },
  validation: {
    model: {
      user: userModelValidation,
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
  },
  pages: {
    Auth: {
      LoginPage: loginPage,
      RegisterPage: registerPage,
    },
  },
  components: {
    Navbar: navbar,
  },
  OnboardingPage: onboardingPage,
  DashboardPage: dashboardPage,
  LandingPage: landingPage,
};

export default messages;

// This type is used to ensure that the messages object matches the expected structure
// pl version is the main version
export type IAppMessagesForLanguage = typeof messages;
