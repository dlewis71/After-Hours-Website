import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Profile fields
    age: { type: Number },
    sex: { type: String },
    ethnicity: { type: String },
    hairColor: { type: String },
    skinColor: { type: String },
    eyeColor: { type: String },
    bodyType: { type: String },
    weight: { type: Number },
    avatar: { type: String },

    subscriber: { type: Boolean, default: false },
    trialEnd: { type: Date },
  },
  { timestamps: true }
);

// Password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;