import { DirectedGraph } from './graphBuilder';

export interface CycleResult {
  cycles: string[][];
  cycleNodes: Set<string>;
}

export function detectCycles(graph: DirectedGraph, maxDepth: number = 6): CycleResult {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const currentPath: string[] = [];
  const cycles: string[][] = [];
  const cycleNodes = new Set<string>();

  function dfs(node: string, depth: number) {
    if (depth > maxDepth) return;

    visited.add(node);
    recursionStack.add(node);
    currentPath.push(node);

    const neighbors = graph.adjacencyOut.get(node) || new Set();
    for (const neighbor of neighbors) {
      if (recursionStack.has(neighbor)) {
        // Cycle detected!
        const cycleStartIndex = currentPath.indexOf(neighbor);
        if (cycleStartIndex !== -1) {
          const detectedCycle = currentPath.slice(cycleStartIndex);
          // Only register non-trivial cycles (length >= 3)
          if (detectedCycle.length >= 3) {
            cycles.push([...detectedCycle, neighbor]);
            detectedCycle.forEach(n => cycleNodes.add(n));
          }
        }
      } else if (!visited.has(neighbor)) {
        dfs(neighbor, depth + 1);
      }
    }

    recursionStack.delete(node);
    currentPath.pop();
  }

  for (const nodeId of graph.nodes.keys()) {
    if (!visited.has(nodeId)) {
      dfs(nodeId, 0);
    }
  }

  return { cycles, cycleNodes };
}
