import { useState, useMemo } from "react";
import { Hero } from "@/components/Hero";
import { MoodSelector } from "@/components/MoodSelector";
import { MovieGrid } from "@/components/MovieGrid";
import { movies, moods } from "@/data/movies";
import { useToast } from "@/hooks/use-toast";
import { useViewingHistory, recommendMovies } from "@/hooks/useViewingHistory";
import { Movie } from "@/types/movie";

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMovies = useMemo(() => {
    let filtered = movies;

    // Filter by mood
    if (selectedMood) {
      filtered = filtered.filter(movie => movie.mood.includes(selectedMood));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(query) ||
        movie.genre.some(genre => genre.toLowerCase().includes(query)) ||
        movie.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedMood, searchQuery]);

  const getTitle = () => {
    if (selectedMood && searchQuery) {
      const mood = moods.find(m => m.id === selectedMood);
      return `${mood?.name} Movies matching "${searchQuery}"`;
    }
    if (selectedMood) {
      const mood = moods.find(m => m.id === selectedMood);
      return `${mood?.name} Movies`;
    }
    if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    }
    return "Featured Movies";
  };

  const { history, addView } = useViewingHistory();
  const { toast } = useToast();

  const handleMovieView = (movie: Movie) => {
    addView(movie.id);
    toast({
      title: "Added to your history",
      description: `${movie.title} added to your viewing history.`,
    });
  };

  const recommendations = useMemo(() => recommendMovies(movies, history), [history]);

  return (
    <div className="min-h-screen bg-hero-gradient">
      {/* Hero Section */}
      <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Mood Selector */}
        <MoodSelector 
          moods={moods}
          selectedMood={selectedMood}
          onMoodSelect={setSelectedMood}
        />
        
        {/* Movies Grid */}
        <MovieGrid 
          movies={filteredMovies}
          title={getTitle()}
          onMovieClick={handleMovieView}
        />
      </div>
      {recommendations.length > 0 && (
        <section className="container mx-auto px-6 pb-12" aria-label="Recommended for you">
          <MovieGrid 
            movies={recommendations}
            title="Recommended for you"
            onMovieClick={handleMovieView}
          />
        </section>
      )}
      
      {/* Footer */}
      <footer className="border-t border-border/20 mt-20">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-muted-foreground">
            © 2024 MoodFlix. Discover movies that match your emotions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;