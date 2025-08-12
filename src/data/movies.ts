import { Movie, Mood } from "@/types/movie";

export const moods: Mood[] = [
  { id: "happy", name: "Happy", emoji: "😊", description: "Feel-good movies to brighten your day" },
  { id: "sad", name: "Sad", emoji: "😢", description: "Emotional dramas that touch the heart" },
  { id: "thrilling", name: "Thrilling", emoji: "😱", description: "Edge-of-your-seat excitement" },
  { id: "romantic", name: "Romantic", emoji: "💕", description: "Love stories to warm your heart" },
  { id: "action", name: "Action", emoji: "💥", description: "High-octane adventures" },
  { id: "funny", name: "Funny", emoji: "😂", description: "Comedies to make you laugh" },
  { id: "mysterious", name: "Mysterious", emoji: "🔍", description: "Mind-bending mysteries" },
  { id: "inspiring", name: "Inspiring", emoji: "⭐", description: "Stories that motivate and uplift" },
];

export const movies: Movie[] = [
  {
    id: 1,
    title: "The Pursuit of Happyness",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
    genre: ["Drama", "Biography"],
    rating: 8.0,
    year: 2006,
    description: "A struggling salesman takes custody of his son as he's poised to begin a life-changing professional career.",
    mood: ["inspiring", "sad", "happy"]
  },
  {
    id: 2,
    title: "Inception",
    poster: "https://images.unsplash.com/photo-1489599142361-b52b2ac8c7bb?w=300&h=450&fit=crop",
    genre: ["Sci-Fi", "Thriller"],
    rating: 8.8,
    year: 2010,
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    mood: ["thrilling", "mysterious", "action"]
  },
  {
    id: 3,
    title: "La La Land",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop",
    genre: ["Musical", "Romance"],
    rating: 8.0,
    year: 2016,
    description: "A jazz musician and an aspiring actress meet and fall in love in Los Angeles.",
    mood: ["romantic", "happy", "inspiring"]
  },
  {
    id: 4,
    title: "The Dark Knight",
    poster: "https://images.unsplash.com/photo-1571847140471-1d7766e825ea?w=300&h=450&fit=crop",
    genre: ["Action", "Crime"],
    rating: 9.0,
    year: 2008,
    description: "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.",
    mood: ["action", "thrilling", "mysterious"]
  },
  {
    id: 5,
    title: "The Grand Budapest Hotel",
    poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop",
    genre: ["Comedy", "Drama"],
    rating: 8.1,
    year: 2014,
    description: "The adventures of Gustave H, a legendary concierge at a famous European hotel.",
    mood: ["funny", "happy", "inspiring"]
  },
  {
    id: 6,
    title: "Gone Girl",
    poster: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=300&h=450&fit=crop",
    genre: ["Mystery", "Thriller"],
    rating: 8.1,
    year: 2014,
    description: "A husband becomes the prime suspect when his wife disappears on their fifth wedding anniversary.",
    mood: ["thrilling", "mysterious", "sad"]
  },
  {
    id: 7,
    title: "The Notebook",
    poster: "https://images.unsplash.com/photo-1522204538344-922f76efcea7?w=300&h=450&fit=crop",
    genre: ["Romance", "Drama"],
    rating: 7.8,
    year: 2004,
    description: "An elderly man reads to a woman with dementia the story of two young lovers.",
    mood: ["romantic", "sad", "inspiring"]
  },
  {
    id: 8,
    title: "Superbad",
    poster: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=300&h=450&fit=crop",
    genre: ["Comedy"],
    rating: 7.6,
    year: 2007,
    description: "Two co-dependent high school seniors are forced to deal with separation anxiety.",
    mood: ["funny", "happy"]
  }
];