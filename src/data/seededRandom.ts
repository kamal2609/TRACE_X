// Deterministic pseudo-random number generator (Mulberry32)
export class SeededRandom {
  private state: number;

  constructor(seed: number = 42819) {
    this.state = seed;
  }

  // Returns float between 0 and 1
  public next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Returns integer in [min, max] inclusive
  public nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Returns float in [min, max]
  public nextFloat(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Random item from array
  public choice<T>(array: T[]): T {
    const idx = Math.floor(this.next() * array.length);
    return array[idx];
  }

  // Shuffle array deterministically
  public shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  public getSeed(): number {
    return this.state;
  }
}
