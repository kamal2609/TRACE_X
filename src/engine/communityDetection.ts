import { DirectedGraph } from './graphBuilder';

export interface CommunityResult {
  communities: Map<string, string[]>; // communityLabel -> array of account_ids
  nodeCommunityMap: Map<string, string>; // account_id -> communityLabel
  componentSizes: Map<string, number>;
}

export function detectCommunities(graph: DirectedGraph, maxIterations: number = 10): CommunityResult {
  const nodeCommunityMap = new Map<string, string>();
  const nodes = Array.from(graph.nodes.keys());

  // 1. Initialize each node with its own unique label
  nodes.forEach(nodeId => {
    nodeCommunityMap.set(nodeId, nodeId);
  });

  // 2. Iteratively update labels based on neighbor frequencies
  for (let iter = 0; iter < maxIterations; iter++) {
    let changed = 0;

    for (const node of nodes) {
      const neighbors = new Set<string>();
      (graph.adjacencyIn.get(node) || []).forEach(n => neighbors.add(n));
      (graph.adjacencyOut.get(node) || []).forEach(n => neighbors.add(n));

      if (neighbors.size === 0) continue;

      // Count neighbor community label weights
      const labelWeights = new Map<string, number>();
      neighbors.forEach(neighbor => {
        const comm = nodeCommunityMap.get(neighbor);
        if (comm) {
          // Weight by edge totalAmount if available
          const outEdge = graph.edges.get(`${node}->${neighbor}`);
          const inEdge = graph.edges.get(`${neighbor}->${node}`);
          const weight = (outEdge?.totalAmount || 0) + (inEdge?.totalAmount || 0) + 1000;
          labelWeights.set(comm, (labelWeights.get(comm) || 0) + weight);
        }
      });

      // Find highest weighted community
      let bestLabel = nodeCommunityMap.get(node)!;
      let maxWeight = -1;
      for (const [comm, weight] of labelWeights.entries()) {
        if (weight > maxWeight) {
          maxWeight = weight;
          bestLabel = comm;
        }
      }

      if (bestLabel !== nodeCommunityMap.get(node)) {
        nodeCommunityMap.set(node, bestLabel);
        changed++;
      }
    }

    if (changed === 0) break; // Converged
  }

  // 3. Group into communities
  const communities = new Map<string, string[]>();
  nodeCommunityMap.forEach((commLabel, nodeId) => {
    if (!communities.has(commLabel)) {
      communities.set(commLabel, []);
    }
    communities.get(commLabel)!.push(nodeId);
  });

  // 4. Calculate component sizes
  const componentSizes = new Map<string, number>();
  nodeCommunityMap.forEach((commLabel, nodeId) => {
    const size = communities.get(commLabel)?.length || 1;
    componentSizes.set(nodeId, size);
  });

  return { communities, nodeCommunityMap, componentSizes };
}
