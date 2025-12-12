/**
 * Core type definitions for the North Pole Strategy Game
 */

/**
 * Evolution stage on the Wardley Map X-axis
 */
export type EvolutionStage = "genesis" | "custom" | "product" | "commodity";

/**
 * Classification type for each component
 */
export type ComponentClassification = "build" | "buy" | "repurpose" | null;

/**
 * Position on the strategy canvas
 */
export interface Position {
  x: number; // 0-100 representing position on evolution axis
  y: number; // 0-100 representing position on value chain axis
}

/**
 * A single strategic component that can be placed on the map
 */
export interface MapComponent {
  id: string;
  name: string;
  description: string;
  correctEvolution: EvolutionStage;
  correctClassification: ComponentClassification;
  correctPosition: Position;
  position: Position | null;
  classification: ComponentClassification;
  isPlaced: boolean;
}

/**
 * Dependency connection between two components
 */
export interface Dependency {
  id: string;
  fromComponentId: string;
  toComponentId: string;
}

/**
 * Badge earned by the player
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

/**
 * Commentary from Rudolph based on user actions
 */
export interface Commentary {
  id: string;
  text: string;
  type: "hint" | "praise" | "correction" | "easter-egg";
  timestamp: number;
}

/**
 * Game state
 */
export interface GameState {
  components: MapComponent[];
  dependencies: Dependency[];
  badges: Badge[];
  commentary: Commentary[];
  score: number;
  isComplete: boolean;
  selectedComponentId: string | null;
  pendingDependencyFromId: string | null;
}

/**
 * Scoring criteria weights
 */
export interface ScoringWeights {
  positionAccuracy: number;
  classificationAccuracy: number;
  dependencyLogic: number;
  completionBonus: number;
}

/**
 * Evolution stage configuration
 */
export interface EvolutionConfig {
  key: EvolutionStage;
  label: string;
  description: string;
  xRange: [number, number]; // Min and max X position for this stage
}
