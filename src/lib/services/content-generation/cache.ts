export class ContentCache {
  private cache: Map<string, { content: string; timestamp: number }>;
  private readonly TTL = 1000 * 60 * 60; // 1 hour

  constructor() {
    this.cache = new Map();
  }

  get(key: string): string | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.content;
  }

  set(key: string, content: string): void {
    this.cache.set(key, {
      content,
      timestamp: Date.now()
    });
  }
}