export const casualString = {
  maxLength: 50,
};

export const userSchema = {
  emailSchema: {
    regex: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  nicknameSchema: {
    minLength: 3,
    maxLength: 16,
    regex: /^[a-zA-Z0-9_-]+$/,
  },
  passwordSchema: {
    minLength: 6,
    maxLength: 16,
    upperCaseRegex: /(?=.*[A-Z])/,
    lowerCaseRegex: /(?=.*[a-z])/,
    digitRegex: /(?=.*\d)/,
    specialCharRegex: /(?=.*[!@#$%^&*(),.?":{}|<>])/,
  },
  firstNameSchema: {
    minLength: 2,
    maxLength: 50,
    regex: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
  },
  lastNameSchema: {
    minLength: 2,
    maxLength: 50,
    regex: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
  },
  yearOfBirthSchema: {
    min: 1900,
    max: new Date().getFullYear(),
  },
};

export enum KrakowAcademy {
  UNIWERSYTET_JAGIELLONSKI = "Uniwersytet Jagielloński",
  AGH = "Akademia Górniczo-Hutnicza im. Stanisława Staszica",
  POLITECHNIKA_KRAKOWSKA = "Politechnika Krakowska im. Tadeusza Kościuszki",
  UNIWERSYTET_EKONOMICZNY = "Uniwersytet Ekonomiczny w Krakowie",
  UNIWERSYTET_PEDAGOGICZNY = "Uniwersytet Pedagogiczny im. Komisji Edukacji Narodowej",
  UNIWERSYTET_ROLNICZY = "Uniwersytet Rolniczy im. Hugona Kołłątaja",
  AKADEMIA_SZTUK_PIEKNYCH = "Akademia Sztuk Pięknych im. Jana Matejki",
  AKADEMIA_MUZYCZNA = "Akademia Muzyczna w Krakowie",
  AKADEMIA_WYCHOWANIA_FIZYCZNEGO = "Akademia Wychowania Fizycznego im. Bronisława Czecha",
  AKADEMIA_TEOLOGICZNA = "Uniwersytet Papieski Jana Pawła II",
  AKADEMIA_IGNATIANUM = "Uniwersytet Ignatianum w Krakowie",
  INNA = "Inna",
}

export enum TrainingGroup {
  PODSTAWOWA = "grupa podstawowa",
  SREDNIOZAAWANSOWANA = "średniozaawansowana",
  ZAAWANSOWANA = "zaawansowana",
  TRENER = "Jestem trenerem!",
  NIE_UCZESTNICZE = "Nie chodzę na zajęcia z brydża na AGH",
}
