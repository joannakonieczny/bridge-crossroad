export const GroupValidationConstants = {
  name: {
    max: 100,
    // letters (including Polish), digits, spaces, dash and underscore
    regex: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s\-_]+$/,
  },
  description: {
    max: 1024,
  },
  invitationCode: {
    length: 8,
    regex: /^[A-Z0-9]{8}$/,
  },
  imageUrl: {
    max: 1024,
  },
};
