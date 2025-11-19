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
  // team related
  tournamentTeamName: {
    min: 2,
    max: 200,
  },
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
  trainingTopic: {
    min: 3,
    max: 500,
  },
  additionalDescription: {
    max: 4000,
  },
};
