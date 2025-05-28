export const userSchema = {
  emailSchema: {
    regex: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  loginSchema: {
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
  nameSchema: {
    minLength: 2,
    maxLength: 50,
    regex: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
  },
  surnameSchema: {
    minLength: 2,
    maxLength: 50,
    regex: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
  },
};
