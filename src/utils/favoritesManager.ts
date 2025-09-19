import type { GeneratedCharacter } from '../types';

export interface FavoriteCharacter extends GeneratedCharacter {
  favoritedAt: string;
  id: string; // Unique identifier for the favorite
}

export class FavoritesManager {
  private static instance: FavoritesManager;
  private storageKey = 'character-studio-favorites';

  private constructor() {}

  static getInstance(): FavoritesManager {
    if (!FavoritesManager.instance) {
      FavoritesManager.instance = new FavoritesManager();
    }
    return FavoritesManager.instance;
  }

  private getFavorites(): FavoriteCharacter[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  private saveFavorites(favorites: FavoriteCharacter[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  addToFavorites(character: GeneratedCharacter): string {
    const favorites = this.getFavorites();
    const id = `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const favoriteCharacter: FavoriteCharacter = {
      ...character,
      id,
      favoritedAt: new Date().toISOString()
    };

    favorites.unshift(favoriteCharacter); // Add to beginning of array
    
    // Keep only the most recent 50 favorites
    if (favorites.length > 50) {
      favorites.splice(50);
    }
    
    this.saveFavorites(favorites);
    return id;
  }

  removeFromFavorites(favoriteId: string): void {
    const favorites = this.getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== favoriteId);
    this.saveFavorites(updatedFavorites);
  }

  isFavorited(character: GeneratedCharacter): boolean {
    const favorites = this.getFavorites();
    return favorites.some(fav => 
      fav.imageUrl === character.imageUrl && 
      fav.pose.id === character.pose.id &&
      fav.timestamp === character.timestamp
    );
  }

  getFavoritesList(): FavoriteCharacter[] {
    return this.getFavorites();
  }

  getFavoritesCount(): number {
    return this.getFavorites().length;
  }

  clearFavorites(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const favoritesManager = FavoritesManager.getInstance();
