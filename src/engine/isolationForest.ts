import { SeededRandom } from '../data/seededRandom';

// True Isolation Forest implementation in TypeScript (Liu et al. 2008)

interface IsolationTreeNode {
  isLeaf: boolean;
  size: number;
  splitFeature?: number;
  splitValue?: number;
  left?: IsolationTreeNode;
  right?: IsolationTreeNode;
}

export interface IsolationForestConfig {
  numTrees?: number;
  subSampleSize?: number;
  seed?: number;
}

export class IsolationForest {
  private numTrees: number;
  private subSampleSize: number;
  private trees: IsolationTreeNode[] = [];
  private rng: SeededRandom;
  private trainedSampleCount: number = 0;

  constructor(config?: IsolationForestConfig) {
    this.numTrees = config?.numTrees ?? 60;
    this.subSampleSize = config?.subSampleSize ?? 128;
    this.rng = new SeededRandom(config?.seed ?? 42819);
  }

  // Euler-Mascheroni constant average path length approximation
  private c(n: number): number {
    if (n <= 1) return 1;
    if (n === 2) return 1;
    const eulerMascheroni = 0.5772156649;
    return 2 * (Math.log(n - 1) + eulerMascheroni) - (2 * (n - 1)) / n;
  }

  public fit(data: number[][]): void {
    if (data.length === 0 || data[0].length === 0) return;

    this.trainedSampleCount = data.length;
    this.trees = [];
    const sampleSize = Math.min(this.subSampleSize, data.length);
    const maxDepth = Math.ceil(Math.log2(Math.max(sampleSize, 2)));

    for (let t = 0; t < this.numTrees; t++) {
      // Sub-sample without replacement
      const shuffledIndices = this.rng.shuffle(Array.from({ length: data.length }, (_, i) => i));
      const sampleIndices = shuffledIndices.slice(0, sampleSize);
      const sample = sampleIndices.map(i => data[i]);

      const tree = this.buildTree(sample, 0, maxDepth);
      this.trees.push(tree);
    }
  }

  private buildTree(data: number[][], currentDepth: number, maxDepth: number): IsolationTreeNode {
    if (currentDepth >= maxDepth || data.length <= 1) {
      return { isLeaf: true, size: data.length };
    }

    const numFeatures = data[0].length;
    // Randomly select a feature
    const featureIdx = this.rng.nextInt(0, numFeatures - 1);

    // Find min and max for this feature in data
    let minVal = Infinity;
    let maxVal = -Infinity;
    for (let i = 0; i < data.length; i++) {
      const val = data[i][featureIdx];
      if (val < minVal) minVal = val;
      if (val > maxVal) maxVal = val;
    }

    if (minVal === maxVal) {
      return { isLeaf: true, size: data.length };
    }

    // Pick random split point
    const splitValue = this.rng.nextFloat(minVal, maxVal);

    const leftData: number[][] = [];
    const rightData: number[][] = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i][featureIdx] < splitValue) {
        leftData.push(data[i]);
      } else {
        rightData.push(data[i]);
      }
    }

    if (leftData.length === 0 || rightData.length === 0) {
      return { isLeaf: true, size: data.length };
    }

    return {
      isLeaf: false,
      size: data.length,
      splitFeature: featureIdx,
      splitValue,
      left: this.buildTree(leftData, currentDepth + 1, maxDepth),
      right: this.buildTree(rightData, currentDepth + 1, maxDepth)
    };
  }

  private pathLength(point: number[], node: IsolationTreeNode, currentDepth: number): number {
    if (node.isLeaf) {
      return currentDepth + this.c(node.size);
    }

    const feature = node.splitFeature!;
    const splitValue = node.splitValue!;

    if (point[feature] < splitValue) {
      return this.pathLength(point, node.left!, currentDepth + 1);
    } else {
      return this.pathLength(point, node.right!, currentDepth + 1);
    }
  }

  // Returns anomaly score between 0 and 100
  public predictAnomalyScore(point: number[]): number {
    if (this.trees.length === 0) return 0;

    let totalPath = 0;
    for (let t = 0; t < this.trees.length; t++) {
      totalPath += this.pathLength(point, this.trees[t], 0);
    }

    const avgPath = totalPath / this.trees.length;
    const sampleSize = Math.min(this.subSampleSize, this.trainedSampleCount || 128);
    const cN = this.c(sampleSize);

    // s(x, n) = 2 ^ (- E(h(x)) / c(n))
    const rawScore = Math.pow(2, -avgPath / cN);

    // Normalize to 0-100 scale: rawScore typically ranges [0.25, 0.85]
    // 0.5 is the theoretical boundary for anomalies
    const normalized = Math.min(100, Math.max(0, Math.round(rawScore * 100)));
    return normalized;
  }

  public predictBatch(data: number[][]): number[] {
    return data.map(point => this.predictAnomalyScore(point));
  }
}
