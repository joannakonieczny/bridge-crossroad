export const EventValidationConstants = {
  title: {
    min: 3,
    max: 200,
    // allow letters (including Polish), digits, spaces, dash, underscore and punctuation commonly used in titles
    regex: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s\-_,.!?():\/"'`]+$/,
  },
  description: {
    max: 4000,
  },
  location: {
    max: 512,
  },
  imageUrl: {
    max: 1024,
  },
};
