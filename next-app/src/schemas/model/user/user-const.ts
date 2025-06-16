export const UserValidationConstants = {
  name: {
    min: 2,
    max: 50,
    regex: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
  },
  yearOfBirth: {
    min: 1900,
    max: new Date().getFullYear(),
  },
  cezarId: {
    length: 8,
    regex: /^\d{8}$/,
  },
  platformIds: {
    max: 20,
  },
  email: {
    max: 50,
    additionalRegex: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  },
  nickname: {
    min: 3,
    max: 16,
    regex: /^[a-zA-Z0-9_-]+$/,
  },
  password: {
    min: 6,
    max: 16,
    noUpperCaseRegex: /(?=.*[A-Z])/,
    noLowerCaseRegex: /(?=.*[a-z])/,
    noDigitRegex: /(?=.*\d)/,
    noSpecialCharRegex: /(?=.*[!@#$%^&*(),.?":{}|<>])/,
  },
};
