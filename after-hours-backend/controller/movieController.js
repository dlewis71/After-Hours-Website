// src/controller/movieController.js
import Movie from "../model/movieModel.js";

// Add movie
export const createMovie = async (req, res, next) => {
  try {
    const { title, url, description } = req.body;
    const movie = await Movie.create({
      user: req.user._id, // automatically set logged-in user
      title,
      url,
      description,
    });
    res.status(201).json(movie); // fixed variable name
  } catch (err) {
    next(err);
  }
};

// Get all movies
export const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find().populate("user", "username"); // fixed model reference
    res.status(200).json(movies);
  } catch (err) {
    next(err);
  }
};
