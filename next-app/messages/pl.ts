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
  minLength: "Min. {minLength} znaki",
  maxLength: "Max. {maxLength} znaków",
  invalidSyntax: "Tylko litery",
};

const tooLongString = "Max. {maxLength} znaków";

const authForm = {
  nicknameField: {
    placeholder: "Nick lub przezwisko (opcjonalne)",
    errorMessage: "Podaj poprawny nick",
    invalidSyntax: "Nick może zawierać tylko litery, cyfry, _ i -",
    minLength: "Nick musi mieć co najmniej {minLength} znaki",
    maxLength: "Nick nie może być dłuższy niż {maxLength} znaków",
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
  },
  emailField: {
    placeholder: "E-mail",
    errorMessage: "Podaj poprawny adres e-mail",
    maxLength: "E-mail nie może być dłuższy niż {maxLength} znaków",
  },
  firstNameField: {
    placeholder: "Imię",
    errorMessage: "Podaj poprawne imię",
    minLength: nameFields.minLength,
    maxLength: nameFields.maxLength,
    invalidSyntax: nameFields.invalidSyntax,
  },
  lastNameField: {
    placeholder: "Nazwisko",
    errorMessage: "Podaj poprawne nazwisko",
    minLength: nameFields.minLength,
    maxLength: nameFields.maxLength,
    invalidSyntax: nameFields.invalidSyntax,
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
      emailField: {
        errorMessage: authForm.emailField.errorMessage,
      },
      nicknameField: {
        invalidSyntax: authForm.nicknameField.invalidSyntax,
        minLength: authForm.nicknameField.minLength,
        maxLength: authForm.nicknameField.maxLength,
      },
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
    university: {
      placeholder: "Wybierz uczelnię",
      noneSelected: "Nie wybrano uczelni",
    },
    yearOfBirth: {
      placeholder: "Wybierz rok urodzenia",
      noneSelected: "Nie wybrano roku urodzenia",
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
      noneSelected: "Nie wybrano grupy zaawansowania",
    },
    hasRefereeLicence: {
      label: "Czy skończyłeś kurs sędziowski?",
    },
    monthYear: {
      placeholder: "Kiedy zacząłeś grać w brydża?",
      noneSelected: "Nie wybrano daty",
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
