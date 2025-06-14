import { Schema, Document, model, models, Types } from "mongoose";

export interface IUserDTO extends Document {
  _id: Types.ObjectId;
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
    startPlayingDate: string; // format MM-YYYY
    trainingGroup: string;
    hasRefereeLicence: boolean;
    cezarId?: string;
    bboId?: string;
    cuebidsId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  groups: Types.ObjectId[];
}

const UserSchema = new Schema<IUserDTO>(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    encodedPassword: {
      type: String,
      required: [true, "Please provide a password"],
    },
    name: {
      firstName: {
        type: String,
        required: [true, "Please provide a first name"],
        trim: true,
        minLength: [2, "First name must be at least 2 characters"],
        maxLength: [50, "First name cannot exceed 50 characters"],
      },
      lastName: {
        type: String,
        required: [true, "Please provide a last name"],
        trim: true,
        minLength: [2, "Last name must be at least 2 characters"],
        maxLength: [50, "Last name cannot exceed 50 characters"],
      },
    },
    nickname: {
      type: String,
      unique: true,
      sparse: true, // allow null/undefined values for uniqueness
      trim: true,
      minLength: [2, "Nickname must be at least 2 characters"],
      maxLength: [30, "Nickname cannot exceed 30 characters"],
    },
    groups: [
      { 
        type: Schema.Types.ObjectId, 
        ref: 'Group',
        required: false,
        default: []
      }
    ],
    onboardingData: {
      type: {
        academy: {
          type: String,
          required: [true, "Academy is required"],
        },
        yearOfBirth: {
          type: Number,
          required: [true, "Year of birth is required"],
          min: [1900, "Year of birth must be at least 1900"],
          max: [
            new Date().getFullYear(),
            "Year of birth cannot be in the future",
          ],
          validate: {
            validator: Number.isInteger,
            message: "Year of birth must be an integer",
          },
        },
        startPlayingDate: {
          type: String,
          required: [true, "Start playing date is required"],
          validate: {
            validator: function (v: string) {
              return /^(0[1-9]|1[0-2])-\d{4}$/.test(v);
            },
            message: "Start playing date must be in MM-YYYY format",
          },
        },
        trainingGroup: {
          type: String,
          required: [true, "Training group is required"],
        },
        hasRefereeLicence: {
          type: Boolean,
          required: [true, "Referee licence status is required"],
          default: false,
        },
        cezarId: {
          type: String,
          trim: true,
          maxLength: [30, "CEZAR ID cannot exceed 30 characters"],
        },
        bboId: {
          type: String,
          trim: true,
          maxLength: [30, "BBO ID cannot exceed 30 characters"],
        },
        cuebidsId: {
          type: String,
          trim: true,
          maxLength: [30, "Cuebids ID cannot exceed 30 characters"],
        },
      },
      required: false, // Cały obiekt onboardingData jest opcjonalny
    },
  },
  // Dodaj automatyczne timestampy dla createdAt i updatedAt
  { timestamps: true },
);

// Zapobieganie ponownemu rejestracji modelu (problem w hot reloadzie Next.js)
export default models.User || model<IUserDTO>("User", UserSchema);
