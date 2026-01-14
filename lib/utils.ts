import { Game } from "./types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate genre statistics from user's games
 * Returns genre distribution as percentile values (0-100)
 */
export function calculateGenreStats(games: Game[]) {
  const targetGenres = ["Action", "RPG", "Strategy", "Puzzle", "Adventure", "Sports", "Horror", "Indie"];
  const genreCounts: Record<string, number> = {};
  
  // Count occurrences of each genre
  games.forEach((game) => {
    if (!game.genres) return;
    
    const genres = game.genres.map((g) => g.name);
    genres.forEach((genres: string) => {
      if (targetGenres.includes(genres)) {
        genreCounts[genres] = (genreCounts[genres] || 0) + 1;
      }
    });
  });

  const maxCount = Math.max(...Object.values(genreCounts), 1);

  // Calculate percentile values (0-100)
  return targetGenres.map((genre) => ({
    name: genre,
    value: Math.round(((genreCounts[genre] || 0) / maxCount) * 100)
  }));
}
