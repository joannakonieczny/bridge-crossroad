export const PartnershipPostValidationConstants = {
  name: {
    min: 3,
    max: 100,
  },
  description: {
    max: 500,
  },
} as const;
