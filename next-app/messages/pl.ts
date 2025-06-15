import { TrainingGroup } from "@/club-preset/training-group";
import { Academy } from "@/club-preset/academy";

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

const nameFields = {
  min: "Min. {min} znaki",
  max: "Max. {max} znaków",
  regex: "Tylko litery",
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
  },
  validation: {
    user: {
      name: {
        firstName: { ...nameFields, required: "Podaj imię" },
        lastName: { ...nameFields, required: "Podaj nazwisko" },
      },
      onboarding: {
        academy: {
          invalid: "Nieprawidłowa uczelnia",
        },
        yearOfBirth: {
          min: "Rok urodzenia nie może być wcześniejszy niż {min}",
          max: "Rok urodzenia nie może być późniejszy niż {max}",
        },
        trainingGroup: {
          invalid: "Nieprawidłowa grupa treningowa",
        },
        cezarId: {
          regexLenght: "Numer Cezar musi składać się z {lenght} cyfr",
        },
        bboId: {
          invalid: "Niepoprawny nick na BBO",
          max: "Max. {max} znaków",
        },
        cuebidsId: {
          invalid: "Niepoprawny kod użytkownika na Cuebids",
          max: "Max. {max} znaków",
        },
      },
      email: {
        regex: "Podaj poprawny adres e-mail",
        max: "E-mail nie może być dłuższy niż {max} znaków",
        required: "E-mail jest wymagany",
      },
      nickname: {
        min: "Nick musi mieć co najmniej {min} znaki",
        max: "Nick nie może być dłuższy niż {max} znaków",
        regex: "Nick może zawierać tylko litery, cyfry, _ i -",
      },
    },
  },
  Auth: {
    LoginPage: loginPage,
    RegisterPage: registerPage,
  },
  OnboardingPage: onboardingPage,
};

export default messages;

// This type is used to ensure that the messages object matches the expected structure
// pl version is the main version
export type IAppMessagesForLanguage = typeof messages;
