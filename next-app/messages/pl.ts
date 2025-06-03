const nameFields = {
  minLength: "Min. {minLength} znaki",
  maxLength: "Max. {maxLength} znaków",
  invalidNameSyntax: "Tylko litery",
};

const authForm = {
  loginField: {
    placeholder: "Login",
    errorMessage: "Podaj poprawny login",
    invalidLoginSyntax: "Login może zawierać tylko litery, cyfry, _ i -",
    minLength: "Login musi mieć co najmniej {minLength} znaki",
    maxLength: "Login nie może być dłuższy niż {maxLength} znaków",
  },
  passwordField: {
    placeholder: "Hasło",
    errorMessage: "Podaj poprawne hasło",
    minLength: "Hasło musi mieć co najmniej {minLength} znaków",
    maxLength: "Hasło nie może być dłuższe niż {maxLength} znaków",
    invalidPasswordSyntax:
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
  nameField: {
    placeholder: "Imię",
    errorMessage: "Podaj poprawne imię",
    minLength: nameFields.minLength,
    maxLength: nameFields.maxLength,
    invalidNameSyntax: nameFields.invalidNameSyntax,
  },
  surnameField: {
    placeholder: "Nazwisko",
    errorMessage: "Podaj poprawne nazwisko",
    minLength: nameFields.minLength,
    maxLength: nameFields.maxLength,
    invalidSurnameSyntax: nameFields.invalidNameSyntax,
  },
  repeatPasswordField: {
    placeholder: "Powtórz hasło",
    errorMessage: "Hasła nie pasują do siebie",
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
    nickName: {
      placeholder: "Twój nick lub brydżowe przezwisko (opcjonalne)",
      errorMessage: "Podaj poprawny nick",
      invalidNickSyntax: "Nick może zawierać tylko litery, cyfry, _ i -",
      minLengthNick: "Nick musi mieć co najmniej {minLength} znaki",
      maxLengthNick: "Nick nie może być dłuższy niż {maxLength} znaków",
    },
    university: {
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
  },
  thirdPage: {
    mainHeading: {
      text: "Nadróbka dodatkowych informacji",
      highlight: "Nadróbka",
    },
    subHeading:
      "Profile brydżowe - ich widoczność dla innych możesz zmienić w ustawieniach",
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
  },
  Auth: {
    LoginPage: {
      title: "Zaloguj się",
      noAccount: {
        text: "Nie masz jeszcze konta?",
        link: "Zarejestruj się",
      },
      form: {
        loginOrEmailField: {
          placeholder: "Login lub email",
          errorMessage: "Podaj poprawny login lub email",
          invalidEmail: authForm.emailField.errorMessage,
          invalidLoginSyntax: authForm.loginField.invalidLoginSyntax,
          minLengthLogin: authForm.loginField.minLength,
          maxLengthLogin: authForm.loginField.maxLength,
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
    },
    RegisterPage: {
      title: "Zarejestruj się",
      hasAccount: {
        text: "Masz już konto?",
        link: "Zaloguj się",
      },
      form: {
        nameField: authForm.nameField,
        surnameField: authForm.surnameField,
        emailField: authForm.emailField,
        passwordField: authForm.passwordField,
        repeatPasswordField: authForm.repeatPasswordField,
      },
      utilities: {
        rememberMe: "Zapamiętaj mnie",
      },
      submitButtons: {
        registerWithGoogle: "Zarejestruj się z Google",
        register: "Zarejestruj się",
      },
    },
  },
  OnboardingPage: onboardingPage,
};

export default messages;

// This type is used to ensure that the messages object matches the expected structure
// pl version is the main version
export type IAppMessagesForLanguage = typeof messages;
