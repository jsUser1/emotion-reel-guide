export type ParsedQuery = {
  genres: string[];
  moods: string[];
  minRating?: number;
  yearGte?: number;
  yearLte?: number;
  maxMinutes?: number;
  minMinutes?: number;
  keywords: string[];
};

const genreMap: Record<string, string> = {
  "comedy": "Comedy",
  "comedies": "Comedy",
  "funny": "Comedy",
  "thriller": "Thriller",
  "thrilling": "Thriller",
  "mystery": "Mystery",
  "mysterious": "Mystery",
  "action": "Action",
  "crime": "Crime",
  "drama": "Drama",
  "biopic": "Biography",
  "biography": "Biography",
  "romance": "Romance",
  "romantic": "Romance",
  "musical": "Musical",
  "sci fi": "Sci-Fi",
  "sci-fi": "Sci-Fi",
  "science fiction": "Sci-Fi",
};

const moodSet = new Set([
  "happy",
  "sad",
  "thrilling",
  "romantic",
  "action",
  "funny",
  "mysterious",
  "inspiring",
]);

function pushUnique<T>(arr: T[], val: T) {
  if (!arr.includes(val)) arr.push(val);
}

export function parseMovieQuery(raw: string): ParsedQuery {
  const q = raw.toLowerCase().trim();
  const result: ParsedQuery = {
    genres: [],
    moods: [],
    keywords: [],
  };

  if (!q) return result;

  // Duration: exact minutes like "90-min", "90 minutes", "under 100 minutes"
  const exactMin = q.match(/(\d{2,3})\s*(?:min|mins|minutes|minute)/);
  if (exactMin) {
    const mins = parseInt(exactMin[1], 10);
    if (!Number.isNaN(mins)) {
      result.maxMinutes = Math.max(mins, 0) + 10; // a bit flexible around the target
    }
  }
  if (/under\s+(\d{2,3})\s*(?:min|mins|minutes)/.test(q) || /less than\s+(\d{2,3})\s*(?:min|mins|minutes)/.test(q)) {
    const m = q.match(/(?:under|less than)\s+(\d{2,3})\s*(?:min|mins|minutes)/);
    if (m) result.maxMinutes = parseInt(m[1], 10);
  }
  if (/short\b/.test(q)) {
    result.maxMinutes = Math.min(result.maxMinutes ?? 100, 100);
  }
  if (/long\b/.test(q)) {
    result.minMinutes = Math.max(result.minMinutes ?? 130, 130);
  }

  // Ratings: patterns like "8+", ">=8", "over 8"
  const plusRating = q.match(/\b(\d(?:\.\d)?)\s*\+/);
  if (plusRating) result.minRating = parseFloat(plusRating[1]);
  const geRating = q.match(/(?:>=|over|above|greater than)\s*(\d(?:\.\d)?)/);
  if (geRating) result.minRating = Math.max(result.minRating ?? 0, parseFloat(geRating[1]));
  if (/highly rated|top rated|great reviews/.test(q)) {
    result.minRating = Math.max(result.minRating ?? 0, 8);
  }

  // Years: "after 2010", "before 2010", "from 2015"
  const after = q.match(/(?:after|from)\s*(19|20)\d{2}/);
  if (after) result.yearGte = parseInt(after[0].match(/(19|20)\d{2}/)![0], 10);
  const before = q.match(/(?:before|pre\s*)\s*(19|20)\d{2}/);
  if (before) result.yearLte = parseInt(before[0].match(/(19|20)\d{2}/)![0], 10);
  if (/recent|new|latest|modern/.test(q)) {
    const currentYear = new Date().getFullYear();
    result.yearGte = Math.max(result.yearGte ?? 0, currentYear - 10);
  }

  // Genres and moods via keyword mapping
  for (const key of Object.keys(genreMap)) {
    if (q.includes(key)) pushUnique(result.genres, genreMap[key]);
  }
  for (const m of moodSet) {
    if (q.includes(m)) pushUnique(result.moods, m);
  }

  // Extract quoted phrases as keywords, else use the raw query as a keyword
  const quoted = [...q.matchAll(/"([^"]+)"|'([^']+)'/g)].map((m) => (m[1] || m[2]).toLowerCase());
  if (quoted.length) {
    result.keywords.push(...quoted);
  } else {
    result.keywords.push(q);
  }

  return result;
}
