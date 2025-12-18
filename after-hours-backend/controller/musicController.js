// src/controller/musicController.js
import Music from "../model/musicModel.js";

// Add music (subscribers only)
export const createMusic = async (req, res, next) => {
  try {
    const { title, url, artist } = req.body;
    const music = await Music.create({
      user: req.user._id,
      title,
      url,
      artist,
    });
    res.status(201).json(music);
  } catch (err) {
    next(err);
  }
};

// Get all music (logged-in users)
export const getMusic = async (req, res, next) => {
  try {
    const music = await Music.find().populate("user", "username");
    res.status(200).json(music);
  } catch (err) {
    next(err);
  }
};
