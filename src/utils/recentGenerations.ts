import type { GeneratedCharacter } from '../types';

export interface RecentGeneration extends GeneratedCharacter {
  id: string;
  generatedAt: string;
}

export class RecentGenerationsManager {
  private static instance: RecentGenerationsManager;
  private storageKey = 'character-studio-recent';

  private constructor() {}

  static getInstance(): RecentGenerationsManager {
    if (!RecentGenerationsManager.instance) {
      RecentGenerationsManager.instance = new RecentGenerationsManager();
    }
    return RecentGenerationsManager.instance;
  }

  private getRecent(): RecentGeneration[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading recent generations:', error);
      return [];
    }
  }

  private saveRecent(recent: RecentGeneration[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(recent));
    } catch (error) {
      console.error('Error saving recent generations:', error);
    }
  }

  addRecentGeneration(character: GeneratedCharacter): void {
    const recent = this.getRecent();
    const id = `recent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const recentGeneration: RecentGeneration = {
      ...character,
      id,
      generatedAt: new Date().toISOString()
    };

    // Add to beginning of array (most recent first)
    recent.unshift(recentGeneration);
    
    // Keep only the most recent 20 generations
    if (recent.length > 20) {
      recent.splice(20);
    }
    
    this.saveRecent(recent);
  }

  addRecentGenerations(characters: GeneratedCharacter[]): void {
    // Add multiple characters at once (for batch generations)
    characters.forEach(character => {
      this.addRecentGeneration(character);
    });
  }

  getRecentList(): RecentGeneration[] {
    return this.getRecent();
  }

  getRecentCount(): number {
    return this.getRecent().length;
  }

  clearRecent(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const recentGenerationsManager = RecentGenerationsManager.getInstance();
