export interface Movie {
  id: number;
  title: string;
  poster: string;
  genre: string[];
  rating: number;
  year: number;
  description: string;
  mood: string[];
}

export interface Mood {
  id: string;
  name: string;
  emoji: string;
  description: string;
}