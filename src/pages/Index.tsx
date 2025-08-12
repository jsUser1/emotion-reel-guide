import { useState, useMemo } from "react";
import { Hero } from "@/components/Hero";
import { MoodSelector } from "@/components/MoodSelector";
import { MovieGrid } from "@/components/MovieGrid";
import { Filters, FiltersState } from "@/components/Filters";
import { movies, moods } from "@/data/movies";
import { useToast } from "@/hooks/use-toast";
import { useViewingHistory, recommendMovies } from "@/hooks/useViewingHistory";
import { Movie } from "@/types/movie";
import { parseMovieQuery } from "@/lib/search";

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { history, addView } = useViewingHistory();
  const { toast } = useToast();

  // Augment base data with default language/platforms
  const augmentedMovies = useMemo(() => {
    const defaults = ["Netflix", "Prime Video", "Hulu", "Disney+", "Max"];
    return movies.map((m) => ({
      ...m,
      language: m.language ?? "English",
      platforms: m.platforms ?? [defaults[m.id % defaults.length]],
    }));
  }, []);

  const allGenres = useMemo(() => Array.from(new Set(movies.flatMap((m) => m.genre))).sort(), []);
  const allLanguages = useMemo(
    () => Array.from(new Set(augmentedMovies.map((m) => (m.language || "").toString()))).filter(Boolean).sort(),
    [augmentedMovies]
  );
  const allPlatforms = useMemo(
    () => Array.from(new Set(augmentedMovies.flatMap((m) => (m.platforms || []) as string[]))).sort(),
    [augmentedMovies]
  );

  const [filters, setFilters] = useState<FiltersState>({
    genre: null,
    yearGte: null,
    yearLte: null,
    language: null,
    runtimeRange: [0, 240],
    minRating: 0,
    platforms: [],
  });

  const handleMovieView = (movie: Movie) => {
    addView(movie.id);
    toast({
      title: "Added to your history",
      description: `${movie.title} added to your viewing history.`,
    });
  };

  const filteredMovies = useMemo(() => {
    let filtered = augmentedMovies;

    // UI Filters
    if (filters.genre) {
      filtered = filtered.filter((m) => m.genre.includes(filters.genre as string));
    }
    if (filters.yearGte != null) {
      filtered = filtered.filter((m) => m.year >= (filters.yearGte as number));
    }
    if (filters.yearLte != null) {
      filtered = filtered.filter((m) => m.year <= (filters.yearLte as number));
    }
    if (filters.language) {
      const lang = (filters.language as string).toLowerCase();
      filtered = filtered.filter((m) => (m.language || "").toLowerCase() === lang);
    }
    if (filters.runtimeRange) {
      const [minR, maxR] = filters.runtimeRange;
      filtered = filtered.filter((m) => m.runtimeMinutes >= minR && m.runtimeMinutes <= maxR);
    }
    if (filters.minRating != null) {
      filtered = filtered.filter((m) => m.rating >= filters.minRating);
    }
    if (filters.platforms.length > 0) {
      const pset = new Set(filters.platforms);
      filtered = filtered.filter((m) => (m.platforms || []).some((p) => pset.has(p)));
    }

    // Mood filter
    if (selectedMood) {
      filtered = filtered.filter((movie) => movie.mood.includes(selectedMood));
    }

    // Natural-language search parsing
    if (searchQuery.trim()) {
      const parsed = parseMovieQuery(searchQuery);
      const hasStructured =
        parsed.genres.length > 0 ||
        parsed.moods.length > 0 ||
        parsed.minRating !== undefined ||
        parsed.yearGte !== undefined ||
        parsed.yearLte !== undefined ||
        parsed.maxMinutes !== undefined ||
        parsed.minMinutes !== undefined;

      if (parsed.genres.length) {
        const gset = new Set(parsed.genres.map((g) => g.toLowerCase()));
        filtered = filtered.filter((movie) => movie.genre.some((genre) => gset.has(genre.toLowerCase())));
      }
      if (parsed.moods.length) {
        const mset = new Set(parsed.moods);
        filtered = filtered.filter((movie) => movie.mood.some((m) => mset.has(m)));
      }
      if (parsed.minRating !== undefined) {
        filtered = filtered.filter((movie) => movie.rating >= (parsed.minRating as number));
      }
      if (parsed.yearGte !== undefined) {
        filtered = filtered.filter((movie) => movie.year >= (parsed.yearGte as number));
      }
      if (parsed.yearLte !== undefined) {
        filtered = filtered.filter((movie) => movie.year <= (parsed.yearLte as number));
      }
      if (parsed.maxMinutes !== undefined) {
        filtered = filtered.filter((movie) => movie.runtimeMinutes <= (parsed.maxMinutes as number));
      }
      if (parsed.minMinutes !== undefined) {
        filtered = filtered.filter((movie) => movie.runtimeMinutes >= (parsed.minMinutes as number));
      }

      // Fallback substring search
      if (!hasStructured) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (movie) =>
            movie.title.toLowerCase().includes(q) ||
            movie.genre.some((genre) => genre.toLowerCase().includes(q)) ||
            movie.description.toLowerCase().includes(q)
        );
      }
    }

    return filtered;
  }, [augmentedMovies, filters, selectedMood, searchQuery]);

  const recommendations = useMemo(() => recommendMovies(movies, history), [history]);

  const getTitle = () => {
    if (selectedMood && searchQuery) {
      const mood = moods.find((m) => m.id === selectedMood);
      return `${mood?.name} Movies matching "${searchQuery}"`;
    }
    if (selectedMood) {
      const mood = moods.find((m) => m.id === selectedMood);
      return `${mood?.name} Movies`;
    }
    if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    }
    return "Featured Movies";
  };

  return (
    <div className="min-h-screen bg-hero-gradient">
      {/* Hero Section */}
      <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Mood Selector */}
        <MoodSelector moods={moods} selectedMood={selectedMood} onMoodSelect={setSelectedMood} />

        {/* Advanced Filters */}
        <Filters
          allGenres={allGenres}
          allLanguages={allLanguages}
          allPlatforms={allPlatforms}
          value={filters}
          onChange={setFilters}
          onReset={() =>
            setFilters({ genre: null, yearGte: null, yearLte: null, language: null, runtimeRange: [0, 240], minRating: 0, platforms: [] })
          }
        />

        {/* Movies Grid */}
        <MovieGrid movies={filteredMovies} title={getTitle()} onMovieClick={handleMovieView} />
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="container mx-auto px-6 pb-12" aria-label="Recommended for you">
          <MovieGrid movies={recommendations} title="Recommended for you" onMovieClick={handleMovieView} />
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border/20 mt-20">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-muted-foreground">© 2024 MoodFlix. Discover movies that match your emotions.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
