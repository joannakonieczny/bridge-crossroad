import mongoose, { Schema, Document } from 'mongoose';

export interface IUserData extends Document {
  email: string;
  encodedPassword: string;
  name: {
    firstName: string;
    lastName: string;
  };
  nickname?: string;

  onboardingData?: {
    academy: string;
    yearOfBirth: number;
    startPlayingDate: string;
    trainingGroup: string;
    hasRefereeLicence: boolean;
    cezarId?: string;
    bboId?: string;
    cuebidsId?: string;
  };
}

const UserSchema = new Schema<IUserData>({
  email: { type: String, required: true, unique: true },
  encodedPassword: { type: String, required: true },
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  nickname: { type: String, unique: true, sparse: true },

  onboardingData: {
    academy: { type: String },
    yearOfBirth: { type: Number },
    startPlayingDate: { type: String },
    trainingGroup: { type: String },
    hasRefereeLicence: { type: Boolean },
    cezarId: { type: String },
    bboId: { type: String },
    cuebidsId: { type: String },
  },
});

export const User = mongoose.models.User || mongoose.model<IUserData>('User', UserSchema);
