interface UserUsage {
  userId: string;
  freeGenerationsUsed: number;
  freeGenerationsLimit: number;
  subscriptionTier: 'free' | 'starter' | 'pro' | null;
  subscriptionExpiry: string | null;
  totalGenerations: number;
  lastGenerationDate: string;
}

const FREE_GENERATIONS_LIMIT = 10;

export class UsageTracker {
  private static instance: UsageTracker;
  private storageKey = 'character-studio-usage';

  private constructor() {}

  static getInstance(): UsageTracker {
    if (!UsageTracker.instance) {
      UsageTracker.instance = new UsageTracker();
    }
    return UsageTracker.instance;
  }

  private getUserId(): string {
    let userId = localStorage.getItem('character-studio-user-id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('character-studio-user-id', userId);
    }
    return userId;
  }

  private getUserUsage(): UserUsage {
    const userId = this.getUserId();
    const stored = localStorage.getItem(this.storageKey);
    
    if (stored) {
      return JSON.parse(stored);
    }

    // Initialize new user
    const newUsage: UserUsage = {
      userId,
      freeGenerationsUsed: 0,
      freeGenerationsLimit: FREE_GENERATIONS_LIMIT,
      subscriptionTier: null,
      subscriptionExpiry: null,
      totalGenerations: 0,
      lastGenerationDate: new Date().toISOString()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(newUsage));
    return newUsage;
  }

  private saveUserUsage(usage: UserUsage): void {
    localStorage.setItem(this.storageKey, JSON.stringify(usage));
  }

  canGenerate(): boolean {
    const usage = this.getUserUsage();
    
    if (usage.subscriptionTier && usage.subscriptionTier !== 'free') {
      return true; // Paid subscription
    }
    
    return usage.freeGenerationsUsed < usage.freeGenerationsLimit;
  }

  recordGeneration(): void {
    const usage = this.getUserUsage();
    usage.freeGenerationsUsed += 1;
    usage.totalGenerations += 1;
    usage.lastGenerationDate = new Date().toISOString();
    this.saveUserUsage(usage);
  }

  getRemainingFreeGenerations(): number {
    const usage = this.getUserUsage();
    return Math.max(0, usage.freeGenerationsLimit - usage.freeGenerationsUsed);
  }

  getUsageStats(): UserUsage {
    return this.getUserUsage();
  }

  upgradeSubscription(tier: 'starter' | 'pro'): void {
    const usage = this.getUserUsage();
    usage.subscriptionTier = tier;
    usage.subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
    this.saveUserUsage(usage);
  }

  resetUsage(): void {
    localStorage.removeItem(this.storageKey);
  }

  isSubscriptionActive(): boolean {
    const usage = this.getUserUsage();
    if (!usage.subscriptionTier || usage.subscriptionTier === 'free') {
      return false;
    }
    
    if (usage.subscriptionExpiry) {
      return new Date(usage.subscriptionExpiry) > new Date();
    }
    
    return false;
  }
}

export const usageTracker = UsageTracker.getInstance();
