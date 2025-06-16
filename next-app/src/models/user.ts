import { Schema, Document, model, models, Types } from "mongoose";
import { UserValidationConstants } from "@/schemas/model/user/user-const";

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
    startPlayingDate: Date;
    trainingGroup: string;
    hasRefereeLicense: boolean;
    cezarId?: string;
    bboId?: string;
    cuebidsId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Pobierz stałe walidacji
const { name, yearOfBirth, cezarId, platformIds, email, nickname } =
  UserValidationConstants;

const UserSchema = new Schema<IUserDTO>(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [email.max, `Email cannot exceed ${email.max} characters`],
      match: [email.additionalRegex, "Please provide a valid email"],
    },
    encodedPassword: {
      type: String,
      required: [true, "Please provide a encoded password"],
    },
    name: {
      firstName: {
        type: String,
        required: [true, "Please provide a first name"],
        trim: true,
        minlength: [
          name.min,
          `First name must be at least ${name.min} characters`,
        ],
        maxlength: [
          name.max,
          `First name cannot exceed ${name.max} characters`,
        ],
        match: [name.regex, "First name contains invalid characters"],
      },
      lastName: {
        type: String,
        required: [true, "Please provide a last name"],
        trim: true,
        minlength: [
          name.min,
          `Last name must be at least ${name.min} characters`,
        ],
        maxlength: [name.max, `Last name cannot exceed ${name.max} characters`],
        match: [name.regex, "Last name contains invalid characters"],
      },
    },
    nickname: {
      type: String,
      unique: true,
      sparse: true, // allow null/undefined values for uniqueness
      trim: true,
      minlength: [
        nickname.min,
        `Nickname must be at least ${nickname.min} characters`,
      ],
      maxlength: [
        nickname.max,
        `Nickname cannot exceed ${nickname.max} characters`,
      ],
      match: [nickname.regex, "Nickname contains invalid characters"],
    },
    onboardingData: {
      type: {
        academy: {
          type: String,
          required: [true, "Academy is required"],
        },
        yearOfBirth: {
          type: Number,
          required: [true, "Year of birth is required"],
          min: [
            yearOfBirth.min,
            `Year of birth must be at least ${yearOfBirth.min}`,
          ],
          max: [yearOfBirth.max, "Year of birth cannot be in the future"],
          validate: {
            validator: Number.isInteger,
            message: "Year of birth must be an integer",
          },
        },
        startPlayingDate: {
          type: Date, // Zmieniono na Date z String
          required: [true, "Start playing date is required"],
        },
        trainingGroup: {
          type: String,
          required: [true, "Training group is required"],
        },
        hasRefereeLicense: {
          type: Boolean,
          required: [true, "Referee license status is required"],
          default: false,
        },
        cezarId: {
          type: String,
          trim: true,
          validate: {
            validator: function (v: string) {
              if (!v) return true;
              return new RegExp(cezarId.regex).test(v);
            },
            message: `CEZAR ID must be ${cezarId.length} digits`,
          },
        },
        bboId: {
          type: String,
          trim: true,
          maxlength: [
            platformIds.max,
            `BBO ID cannot exceed ${platformIds.max} characters`,
          ],
        },
        cuebidsId: {
          type: String,
          trim: true,
          maxlength: [
            platformIds.max,
            `Cuebids ID cannot exceed ${platformIds.max} characters`,
          ],
        },
      },
      required: false, // Onboarding data is optional
    },
  },
  // auto timestamps for createdAt and updatedAt
  { timestamps: true }
);

// Prevent re-registering the model (issue with hot reload in Next.js)
export default models.User || model<IUserDTO>("User", UserSchema);
