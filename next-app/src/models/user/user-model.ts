"server-only";

import { UserValidationConstants } from "@/schemas/model/user/user-const";
import { Schema, model, models } from "mongoose";
import { UserId, UserTableName, type IUserDTO } from "./user-types";
const { name, yearOfBirth, cezarId, platformIds, email, nickname } =
  UserValidationConstants;

const UserSchema = new Schema<IUserDTO>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: email.max,
      match: email.additionalRegex,
    },
    encodedPassword: {
      type: String,
      required: true,
    },
    name: {
      firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: name.min,
        maxlength: name.max,
        match: name.regex,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: name.min,
        maxlength: name.max,
        match: name.regex,
      },
    },
    nickname: {
      type: String,
      unique: true,
      sparse: true, // allow null/undefined values for uniqueness
      trim: true,
      minlength: nickname.min,
      maxlength: nickname.max,
      match: nickname.regex,
    },
    groups: {
      type: [{ type: UserId, ref: "Group" }],
      default: [],
      required: true,
    },
    onboardingData: {
      type: {
        academy: {
          type: String,
          required: true,
        },
        yearOfBirth: {
          type: Number,
          required: true,
          min: yearOfBirth.min,
          max: yearOfBirth.max,
          validate: {
            validator: Number.isInteger,
          },
        },
        startPlayingDate: {
          type: Date,
          required: true,
        },
        trainingGroup: {
          type: String,
          required: true,
        },
        hasRefereeLicense: {
          type: Boolean,
          required: true,
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
          },
        },
        bboId: {
          type: String,
          trim: true,
          maxlength: platformIds.max,
        },
        cuebidsId: {
          type: String,
          trim: true,
          maxlength: platformIds.max,
        },
      },
      required: false, // Onboarding data is optional
    },
  },
  // auto timestamps for createdAt and updatedAt
  { timestamps: true }
);

// Prevent re-registering the model (issue with hot reload in Next.js)
export default models.User || model<IUserDTO>(UserTableName, UserSchema);
