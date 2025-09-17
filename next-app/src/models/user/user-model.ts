"server-only";

import { UserValidationConstants as c } from "@/schemas/model/user/user-const";
import mongoose, { Schema, model } from "mongoose";
import { UserId, UserTableName, type IUserDTO } from "./user-types";
import { GroupTableName } from "../group/group-types";

const UserSchema = new Schema<IUserDTO>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: c.email.max,
      match: c.email.additionalRegex,
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
        minlength: c.name.min,
        maxlength: c.name.max,
        match: c.name.regex,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: c.name.min,
        maxlength: c.name.max,
        match: c.name.regex,
      },
    },
    nickname: {
      type: String,
      unique: true,
      sparse: true, // allow null/undefined values for uniqueness
      trim: true,
      minlength: c.nickname.min,
      maxlength: c.nickname.max,
      match: c.nickname.regex,
    },
    groups: {
      type: [{ type: UserId, ref: GroupTableName }],
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
          min: c.yearOfBirth.min,
          max: c.yearOfBirth.max,
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
              return new RegExp(c.cezarId.regex).test(v);
            },
          },
        },
        bboId: {
          type: String,
          trim: true,
          maxlength: c.platformIds.max,
        },
        cuebidsId: {
          type: String,
          trim: true,
          maxlength: c.platformIds.max,
        },
      },
      required: false, // Onboarding data is optional
    },
  },
  // auto timestamps for createdAt and updatedAt
  { timestamps: true }
);

// Prevent re-registering the model (issue with hot reload in Next.js)
export default mongoose.models.User ||
  model<IUserDTO>(UserTableName, UserSchema);
