import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  onMovieClick?: (movie: Movie) => void;
}

export const MovieGrid = ({ movies, title, onMovieClick }: MovieGridProps) => {
  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No movies found for this mood. Try selecting a different mood!</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onView={onMovieClick} />
        ))}
      </div>
    </div>
  );
};