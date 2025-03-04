const { Schema, model } = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      maxLength: 20,
      lowercase: true,
    },

    userName: {
      type: String,
      unique: true,
      required: true,
      maxLength: 20,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxLength: 40,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "invalid email try something else :( ",
      },
    },
    password: {
      type: String,
      minLength: 8,
      maxLength: 100,
      trim: true,
      required: true,
      select: false,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Others"],
        message:
          "invalid Gender . Allowed values for Gender are Male , Female and Others",
      },
    },
    dob: {
      type: Date,
      validate: {
        validator: function (value) {
          const today = new Date();
          const minAge = 18;
          const BirthDate = new Date(value);

          if (BirthDate >= today) {
            return false;
          }

          const age = today.getFullYear() - BirthDate.getFullYear();

          return age >= minAge ? true : false;
        },
        message:
          "Birth date must be in the past , and you must be an adult (i.e age >= 18 )",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isProfileSetup: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      default: "This is default bio and something that describe you",
    },
    profilePicture: {
      type: String,
      default:
        "https://prince.info.np/static/media/prince.71204db128ccdbebba5c.png",
      validate: {
        validator: function (value) {
          const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
          return imageExtensions.test(value) && validator.isURL(value);
        },
        message: "invalid photo url",
      },
    },
    location: {
      type: String,
      maxLength: 50,
      lowercase: true,
    },
    interest: {
      type: [String],
      default: [],
      lowercase: true,
      validate: {
        validator: function (value) {
          return value.length <= 10;
        },
        message: "too many interest added there can be only max 10 :( ",
      },
    },
    matches: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    isPremiumUser: {
      type: Boolean,
      default: false,
    },

    lastActive: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

UserSchema.methods.validatePassword = async function (password) {
  const user = this;
  const IsPassword = await bcrypt.compare(password, user.password);
  return IsPassword;
};

module.exports = model("User", UserSchema);
