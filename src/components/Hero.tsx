import { Search, Film } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-cinema.jpg";

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Hero = ({ searchQuery, onSearchChange }: HeroProps) => {
  return (
    <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Film className="w-12 h-12 text-accent" />
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            MoodFlix
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover the perfect movie for your mood. Let your emotions guide your next cinematic adventure.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search movies by title or genre..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-12 bg-card/80 backdrop-blur-sm border-border/50 focus:border-primary transition-colors duration-300"
            />
          </div>
          <Button 
            size="lg" 
            className="h-12 bg-accent-gradient hover:scale-105 transition-all duration-300 shadow-glow"
          >
            Discover
          </Button>
        </div>
      </div>
    </div>
  );
};