import { games } from '@/lib/game-data';

export function getGames() {
  return games;
}

export function getGameBySlug(slug) {
  return games.find((game) => game.slug === slug);
}