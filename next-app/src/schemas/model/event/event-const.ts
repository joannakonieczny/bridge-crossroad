export const EventValidationConstants = {
  title: {
    min: 3,
    max: 200,
    // allow letters (including Polish), digits, spaces, dash, underscore and punctuation commonly used in titles
    regex: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s\-_,.!?():/"'`]+$/,
  },
  description: {
    max: 4000,
  },
  location: {
    max: 512,
  },
  // team related
  team: {
    members: {
      min: 4,
    },
    name: {
      min: 4,
      max: 100,
    },
  },
  // league/training related
  opponentTeamName: {
    max: 200,
  },
  additionalDescription: {
    max: 4000,
  },
  trainingTopic: {
    min: 3,
    max: 500,
  },
};
