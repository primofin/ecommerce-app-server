import Movie, { MovieDocument } from '../models/Movie'

function create(movie: MovieDocument): Promise<MovieDocument> {
  return movie.save()
}

async function findById(movieId: string): Promise<MovieDocument> {
  const movie = await Movie.findById(movieId).exec() // .exec() will return a true Promise

  if (!movie) {
    throw new Error(`Movie ${movieId} not found`)
  }
  return movie
}

function findAll(): Promise<MovieDocument[]> {
  return Movie.find().sort({ name: 1, publishedYear: -1 }).exec() // Return a Promise
}

async function update(
  movieId: string,
  update: Partial<MovieDocument>
): Promise<MovieDocument> {
  const movie = await Movie.findById(movieId).exec()
  if (!movie) {
    throw new Error(`Movie ${movieId} not found`)
  }
  if (update.name) {
    movie.name = update.name
  }
  if (update.publishedYear) {
    movie.publishedYear = update.publishedYear
  }
  if (update.duration) {
    movie.duration = update.duration
  }
  return movie.save()
}

function deleteMovie(movieId: string): Promise<MovieDocument | null> {
  return Movie.findByIdAndDelete(movieId).exec()
}

export default {
  create,
  findById,
  findAll,
  update,
  deleteMovie,
}
