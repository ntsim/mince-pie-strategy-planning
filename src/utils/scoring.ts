/**
 * Scoring logic for the strategy mapping game
 */

import type {
  Dependency,
  EvolutionStage,
  MapComponent,
  Position,
  ScoringWeights,
} from "../types/game.types";
import { CORRECT_DEPENDENCIES, EVOLUTION_STAGES } from "./gameData";

/**
 * Scoring weights for different aspects of the game
 */
const WEIGHTS: ScoringWeights = {
  positionAccuracy: 30,
  classificationAccuracy: 30,
  dependencyLogic: 25,
  completionBonus: 15,
};

/**
 * Calculate distance between two positions
 */
function calculateDistance(pos1: Position, pos2: Position): number {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Get evolution stage from X position
 */
function getEvolutionStageFromX(x: number): EvolutionStage {
  for (const stage of EVOLUTION_STAGES) {
    if (x >= stage.xRange[0] && x < stage.xRange[1]) {
      return stage.key;
    }
  }
  return "commodity"; // Default to last stage
}

/**
 * Calculate score for component positioning accuracy
 */
function calculatePositionScore(components: MapComponent[]): number {
  const placedComponents = components.filter(
    (c) => c.isPlaced && c.position !== null,
  );

  if (placedComponents.length === 0) {
    return 0;
  }

  let totalScore = 0;

  for (const component of placedComponents) {
    if (!component.position) continue;

    const distance = calculateDistance(
      component.position,
      component.correctPosition,
    );

    // Score decreases with distance, max distance is ~141 (diagonal across 100x100 grid)
    const maxDistance = 141;
    const normalizedDistance = Math.min(distance / maxDistance, 1);

    // Exponential decay: closer positions get much higher scores
    const componentScore = Math.pow(1 - normalizedDistance, 2) * 100;
    totalScore += componentScore;
  }

  return (
    (totalScore / placedComponents.length) * (WEIGHTS.positionAccuracy / 100)
  );
}

/**
 * Calculate score for component classification accuracy
 */
function calculateClassificationScore(components: MapComponent[]): number {
  const classifiedComponents = components.filter(
    (c) => c.classification !== null,
  );

  if (classifiedComponents.length === 0) {
    return 0;
  }

  const correctClassifications = classifiedComponents.filter(
    (c) => c.classification === c.correctClassification,
  ).length;

  return (
    (correctClassifications / classifiedComponents.length) *
    WEIGHTS.classificationAccuracy
  );
}

/**
 * Calculate score for dependency logic
 */
function calculateDependencyScore(dependencies: Dependency[]): number {
  if (dependencies.length === 0) {
    return 0;
  }

  let correctDependencies = 0;

  for (const dep of dependencies) {
    const isCorrect = CORRECT_DEPENDENCIES.some(
      ([from, to]) =>
        (dep.fromComponentId === from && dep.toComponentId === to) ||
        (dep.fromComponentId === to && dep.toComponentId === from),
    );

    if (isCorrect) {
      correctDependencies++;
    }
  }

  // Score based on ratio of correct dependencies
  const accuracy =
    correctDependencies /
    Math.max(dependencies.length, CORRECT_DEPENDENCIES.length);
  return accuracy * WEIGHTS.dependencyLogic;
}

/**
 * Calculate completion bonus
 */
function calculateCompletionBonus(components: MapComponent[]): number {
  const allPlaced = components.every((c) => c.isPlaced);
  const allClassified = components.every((c) => c.classification !== null);

  if (allPlaced && allClassified) {
    return WEIGHTS.completionBonus;
  }

  const placedRatio =
    components.filter((c) => c.isPlaced).length / components.length;
  const classifiedRatio =
    components.filter((c) => c.classification !== null).length /
    components.length;

  return ((placedRatio + classifiedRatio) / 2) * WEIGHTS.completionBonus;
}

/**
 * Calculate total strategic clarity score
 */
export function calculateTotalScore(
  components: MapComponent[],
  dependencies: Dependency[],
): number {
  const positionScore = calculatePositionScore(components);
  const classificationScore = calculateClassificationScore(components);
  const dependencyScore = calculateDependencyScore(dependencies);
  const completionBonus = calculateCompletionBonus(components);

  return Math.round(
    positionScore + classificationScore + dependencyScore + completionBonus,
  );
}

/**
 * Check if a specific badge should be earned
 */
export function checkBadgeEarned(
  badgeId: string,
  components: MapComponent[],
  dependencies: Dependency[],
): boolean {
  switch (badgeId) {
    case "cloud-wisdom": {
      // Correctly identified cloud compute as commodity and buy
      const cloudCompute = components.find((c) => c.id === "cloud-compute");
      if (!cloudCompute || !cloudCompute.position) return false;

      const evolution = getEvolutionStageFromX(cloudCompute.position.x);
      return evolution === "commodity" && cloudCompute.classification === "buy";
    }

    case "innovation-star": {
      // Correctly identified all genesis components as build
      const genesisComponents = components.filter(
        (c) => c.correctEvolution === "genesis",
      );
      return genesisComponents.every((c) => {
        if (!c.position) return false;
        const evolution = getEvolutionStageFromX(c.position.x);
        return evolution === "genesis" && c.classification === "build";
      });
    }

    case "reindeer-efficiency": {
      // Correctly identified repurpose component
      const repurposeComponent = components.find(
        (c) => c.correctClassification === "repurpose",
      );
      return repurposeComponent?.classification === "repurpose";
    }

    case "strategic-mapper": {
      // Completed with score > 70
      const score = calculateTotalScore(components, dependencies);
      return score >= 70;
    }

    case "dependency-master": {
      // Created at least 5 correct dependencies
      const correctDeps = dependencies.filter((dep) =>
        CORRECT_DEPENDENCIES.some(
          ([from, to]) =>
            (dep.fromComponentId === from && dep.toComponentId === to) ||
            (dep.fromComponentId === to && dep.toComponentId === from),
        ),
      );
      return correctDeps.length >= 5;
    }

    default:
      return false;
  }
}

/**
 * Get position accuracy percentage for a component
 */
export function getPositionAccuracy(component: MapComponent): number {
  if (!component.position) return 0;

  const distance = calculateDistance(
    component.position,
    component.correctPosition,
  );
  const maxDistance = 141;
  const normalizedDistance = Math.min(distance / maxDistance, 1);

  return Math.round((1 - normalizedDistance) * 100);
}

/**
 * Check if classification is correct
 */
export function isClassificationCorrect(component: MapComponent): boolean {
  return component.classification === component.correctClassification;
}

/**
 * Check if evolution stage placement is correct
 */
export function isEvolutionCorrect(component: MapComponent): boolean {
  if (!component.position) return false;

  const actualEvolution = getEvolutionStageFromX(component.position.x);
  return actualEvolution === component.correctEvolution;
}
