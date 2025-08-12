import { useEffect, useMemo, useState } from "react";
import { Movie } from "@/types/movie";

export type ViewEntry = {
  movieId: number;
  lastViewedAt: number; // epoch ms
  count: number;
};

const STORAGE_KEY = "moodflix_history_v1";
const MAX_HISTORY = 50;

function loadHistory(): ViewEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ViewEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (e) =>
          e && typeof e.movieId === "number" && typeof e.lastViewedAt === "number" && typeof e.count === "number"
      )
      .sort((a, b) => b.lastViewedAt - a.lastViewedAt)
      .slice(0, MAX_HISTORY);
  } catch {
    return [];
  }
}

function saveHistory(history: ViewEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch {
    // ignore write errors (e.g., private mode)
  }
}

export function useViewingHistory() {
  const [history, setHistory] = useState<ViewEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addView = (movieId: number) => {
    setHistory((prev) => {
      const now = Date.now();
      let next = [...prev];
      const idx = next.findIndex((e) => e.movieId === movieId);
      if (idx >= 0) {
        const existing = next[idx];
        next[idx] = { ...existing, lastViewedAt: now, count: existing.count + 1 };
      } else {
        next.unshift({ movieId, lastViewedAt: now, count: 1 });
      }
      next.sort((a, b) => b.lastViewedAt - a.lastViewedAt);
      if (next.length > MAX_HISTORY) next = next.slice(0, MAX_HISTORY);
      saveHistory(next);
      return next;
    });
  };

  const clearHistory = () => {
    saveHistory([]);
    setHistory([]);
  };

  return { history, addView, clearHistory } as const;
}

function intersectionCount<T>(a: T[], b: T[]): number {
  const setB = new Set(b);
  let count = 0;
  for (const x of a) if (setB.has(x)) count++;
  return count;
}

// Content-based recommender using mood/genre similarity + time decay + repeat views weighting
export function recommendMovies(allMovies: Movie[], history: ViewEntry[], limit = 8): Movie[] {
  if (!history.length) return [];

  const byId = new Map(allMovies.map((m) => [m.id, m] as const));
  const viewedIds = new Set(history.map((h) => h.movieId));

  const now = Date.now();
  const halfLifeDays = 7; // 1-week half-life
  const lambda = Math.log(2) / (halfLifeDays * 24 * 60 * 60 * 1000);

  const scores = new Map<number, number>();

  for (const entry of history) {
    const viewed = byId.get(entry.movieId);
    if (!viewed) continue;

    const ageMs = now - entry.lastViewedAt;
    const timeDecay = Math.exp(-lambda * ageMs);
    const repeatWeight = 1 + 0.5 * Math.max(0, entry.count - 1);
    const weight = timeDecay * repeatWeight;

    for (const candidate of allMovies) {
      if (viewedIds.has(candidate.id) || candidate.id === viewed.id) continue;
      const moodOverlap = intersectionCount(candidate.mood, viewed.mood) / Math.max(1, candidate.mood.length);
      const genreOverlap = intersectionCount(candidate.genre, viewed.genre) / Math.max(1, candidate.genre.length);
      const similarity = 1.5 * moodOverlap + 1.0 * genreOverlap;
      if (similarity <= 0) continue;
      scores.set(candidate.id, (scores.get(candidate.id) ?? 0) + similarity * weight);
    }
  }

  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
  const result: Movie[] = [];
  for (const id of ranked) {
    const m = byId.get(id);
    if (m) result.push(m);
    if (result.length >= limit) break;
  }
  return result;
}
