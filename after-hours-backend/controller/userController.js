import User from "../model/userModel.js";
import jwt from "jsonwebtoken";

// --- JWT generator ---
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });

// --- Standard error response ---
const sendError = (res, message, code = 400) => res.status(code).json({ message });

// --- Ensure trialEnd exists (only set if missing) ---
const ensureTrialEnd = async (user) => {
  if (!user.trialEnd) {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 3); // 3-day trial
    user.trialEnd = trialEndDate;
    await user.save();
  }
  return user;
};

// --- Standardize User Response Payload ---
const getProfilePayload = (user, token) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.username,
  email: user.email,
  subscriber: user.subscriber,
  trialEnd: user.trialEnd, // persistent trial date
  age: user.age,
  sex: user.sex,
  ethnicity: user.ethnicity,
  hairColor: user.hairColor,
  skinColor: user.skinColor,
  eyeColor: user.eyeColor,
  bodyType: user.bodyType,
  weight: user.weight,
  avatar: user.avatar,
  token: token,
});

// --- Signup (Register) ---
export const signupUser = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    if (!firstName || !lastName || !username || !email || !password)
      return sendError(res, "All fields are required");

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email)
        return sendError(res, "A user with this email already exists.");
      if (existingUser.username === username)
        return sendError(res, "This username is already taken.");
    }

    // Set trial only on first signup
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 3);

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password,
      trialEnd: trialEndDate,
      age: req.body.age,
      sex: req.body.sex,
      ethnicity: req.body.ethnicity,
      hairColor: req.body.hairColor,
      skinColor: req.body.skinColor,
      eyeColor: req.body.eyeColor,
      bodyType: req.body.bodyType,
      weight: req.body.weight,
      avatar: req.body.avatar,
    });

    const token = generateToken(user._id);
    res.status(201).json(getProfilePayload(user, token));
  } catch (err) {
    next(err);
  }
};

// --- Login ---
export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password)))
      return sendError(res, "Invalid credentials", 401);

    // ✅ Only set trial if missing (persists across logins)
    await ensureTrialEnd(user);

    const token = generateToken(user._id);
    res.status(200).json(getProfilePayload(user, token));
  } catch (err) {
    next(err);
  }
};

// --- Get User Profile ---
export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user?.id;
    if (!userId) return sendError(res, "User ID missing");

    const user = await User.findById(userId).select("-password");
    if (!user) return sendError(res, "User not found", 404);

    // ✅ Ensure trialEnd exists
    await ensureTrialEnd(user);

    const token = generateToken(user._id);
    res.status(200).json(getProfilePayload(user, token));
  } catch (err) {
    next(err);
  }
};

// --- Update User Profile ---
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user?.id;
    if (!userId) return sendError(res, "User ID missing");

    const user = await User.findById(userId).select("-password");
    if (!user) return sendError(res, "User not found", 404);

    // Only allow profile fields to be updated
    const allowedFields = [
      "age",
      "sex",
      "ethnicity",
      "hairColor",
      "skinColor",
      "eyeColor",
      "bodyType",
      "weight",
      "avatar",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    await user.save();

    const token = generateToken(user._id);
    res.status(200).json(getProfilePayload(user, token));
  } catch (err) {
    next(err);
  }
};
