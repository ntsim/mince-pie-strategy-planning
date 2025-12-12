/**
 * Game data configuration including components, badges, and evolution stages
 */

import type { Badge, EvolutionConfig, MapComponent } from "../types/game.types";

/**
 * Evolution stage configurations with X-axis ranges
 */
export const EVOLUTION_STAGES: EvolutionConfig[] = [
  {
    key: "genesis",
    label: "Genesis",
    description: "Novel, uncertain, rapidly changing",
    xRange: [0, 25],
  },
  {
    key: "custom",
    label: "Custom Built",
    description: "Emerging, stabilizing",
    xRange: [25, 50],
  },
  {
    key: "product",
    label: "Product/Service",
    description: "Mature, well understood",
    xRange: [50, 75],
  },
  {
    key: "commodity",
    label: "Commodity/Utility",
    description: "Ubiquitous, standardized",
    xRange: [75, 100],
  },
];

/**
 * Initial components to be placed on the map
 */
export const INITIAL_COMPONENTS: MapComponent[] = [
  {
    id: "mince-pie-delivery",
    name: "Mince Pie Delivery",
    description: "The core service delivering festive treats",
    correctEvolution: "product",
    correctClassification: "build",
    correctPosition: { x: 65, y: 85 },
    position: null,
    classification: null,
    isPlaced: false,
  },
  {
    id: "encounter-agents",
    name: "Existing Encounter Agents",
    description: "Pre-existing customer interaction systems",
    correctEvolution: "custom",
    correctClassification: "repurpose",
    correctPosition: { x: 40, y: 70 },
    position: null,
    classification: null,
    isPlaced: false,
  },
  {
    id: "ai-recipe-generator",
    name: "AI Recipe Generator",
    description: "Novel AI system for creating festive recipes",
    correctEvolution: "genesis",
    correctClassification: "build",
    correctPosition: { x: 15, y: 55 },
    position: null,
    classification: null,
    isPlaced: false,
  },
  {
    id: "delivery-routing",
    name: "Delivery Routing Service",
    description: "Optimized path planning for deliveries",
    correctEvolution: "product",
    correctClassification: "buy",
    correctPosition: { x: 60, y: 50 },
    position: null,
    classification: null,
    isPlaced: false,
  },
  {
    id: "orchestration-framework",
    name: "Multi-Agent Orchestration Framework",
    description: "Coordinates multiple AI agents",
    correctEvolution: "custom",
    correctClassification: "build",
    correctPosition: { x: 35, y: 45 },
    position: null,
    classification: null,
    isPlaced: false,
  },
  {
    id: "foundational-ai",
    name: "Foundational AI Models",
    description: "Large language models and AI infrastructure",
    correctEvolution: "product",
    correctClassification: "buy",
    correctPosition: { x: 65, y: 30 },
    position: null,
    classification: null,
    isPlaced: false,
  },
  {
    id: "cloud-compute",
    name: "Cloud Compute and Storage",
    description: "Infrastructure as a service",
    correctEvolution: "commodity",
    correctClassification: "buy",
    correctPosition: { x: 85, y: 25 },
    position: null,
    classification: null,
    isPlaced: false,
  },
  {
    id: "network-comms",
    name: "Network & Communications",
    description: "Basic networking infrastructure",
    correctEvolution: "commodity",
    correctClassification: "buy",
    correctPosition: { x: 90, y: 15 },
    position: null,
    classification: null,
    isPlaced: false,
  },
  {
    id: "trust-framework",
    name: "Trust & Transparency Framework",
    description: "System for ensuring ethical AI operations",
    correctEvolution: "genesis",
    correctClassification: "build",
    correctPosition: { x: 20, y: 40 },
    position: null,
    classification: null,
    isPlaced: false,
  },
  {
    id: "elf-dashboard",
    name: "ELF Operations Dashboard",
    description: "Monitoring and control interface",
    correctEvolution: "custom",
    correctClassification: "build",
    correctPosition: { x: 45, y: 60 },
    position: null,
    classification: null,
    isPlaced: false,
  },
  {
    id: "coordination-centre",
    name: "Multi-Agent Coordination Centre",
    description: "Central hub for agent communication",
    correctEvolution: "custom",
    correctClassification: "build",
    correctPosition: { x: 38, y: 35 },
    position: null,
    classification: null,
    isPlaced: false,
  },
];

/**
 * Badges that can be earned during gameplay
 */
export const INITIAL_BADGES: Badge[] = [
  {
    id: "cloud-wisdom",
    name: "Cloud Wisdom",
    description: "Correctly identified commodity cloud services",
    icon: "☁️",
    earned: false,
  },
  {
    id: "innovation-star",
    name: "Innovation Star",
    description: "Identified novel components to build",
    icon: "⭐",
    earned: false,
  },
  {
    id: "reindeer-efficiency",
    name: "Reindeer Efficiency",
    description: "Made smart repurpose decisions",
    icon: "🦌",
    earned: false,
  },
  {
    id: "strategic-mapper",
    name: "Strategic Mapper",
    description: "Completed the map with high strategic clarity",
    icon: "🗺️",
    earned: false,
  },
  {
    id: "dependency-master",
    name: "Dependency Master",
    description: "Created logical component dependencies",
    icon: "🔗",
    earned: false,
  },
];

/**
 * Correct dependencies between components
 */
export const CORRECT_DEPENDENCIES: Array<[string, string]> = [
  ["mince-pie-delivery", "elf-dashboard"],
  ["mince-pie-delivery", "delivery-routing"],
  ["elf-dashboard", "orchestration-framework"],
  ["delivery-routing", "cloud-compute"],
  ["ai-recipe-generator", "foundational-ai"],
  ["orchestration-framework", "coordination-centre"],
  ["orchestration-framework", "foundational-ai"],
  ["foundational-ai", "cloud-compute"],
  ["cloud-compute", "network-comms"],
  ["coordination-centre", "cloud-compute"],
  ["encounter-agents", "orchestration-framework"],
  ["trust-framework", "orchestration-framework"],
];
