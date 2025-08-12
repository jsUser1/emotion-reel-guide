import { Movie } from "@/types/movie";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  onView?: (movie: Movie) => void;
}

export const MovieCard = ({ movie, onView }: MovieCardProps) => {
  return (
    <div
      className="group relative bg-card-gradient rounded-lg overflow-hidden shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2 cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={() => onView?.(movie)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onView?.(movie);
        }
      }}
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-foreground font-semibold mb-1 line-clamp-1">{movie.title}</h3>
        <p className="text-muted-foreground text-sm mb-2">{movie.year} • {movie.genre.join(", ")}</p>
        
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="text-accent font-medium">{movie.rating}</span>
        </div>
        
        <p className="text-muted-foreground text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          {movie.description}
        </p>
      </div>
    </div>
  );
};