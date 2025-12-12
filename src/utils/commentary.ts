/**
 * Commentary system for Rudolph's witty remarks
 */

import type {
  Commentary,
  ComponentClassification,
  MapComponent,
} from "../types/game.types";

let commentaryIdCounter = 0;

/**
 * Generate a unique commentary ID
 */
function generateCommentaryId(): string {
  return `commentary-${Date.now()}-${commentaryIdCounter++}`;
}

/**
 * Create a commentary object
 */
function createCommentary(
  text: string,
  type: Commentary["type"] = "hint",
): Commentary {
  return {
    id: generateCommentaryId(),
    text,
    type,
    timestamp: Date.now(),
  };
}

/**
 * Get commentary for placing a component
 */
export function getPlacementCommentary(
  component: MapComponent,
): Commentary | null {
  // Cloud compute easter egg
  if (component.id === "cloud-compute") {
    return createCommentary(
      "That's already on Jeff's cloud shelf! Smart move going with AWS, Azure, or GCP.",
      "easter-egg",
    );
  }

  // AI Recipe Generator - novel component
  if (component.id === "ai-recipe-generator") {
    return createCommentary(
      "Steady there! That AI recipe generator looks novel - should we build or buy?",
      "hint",
    );
  }

  // Foundational AI Models
  if (component.id === "foundational-ai") {
    return createCommentary(
      "These LLMs are becoming productized. OpenAI, Anthropic... they're practically on every shelf now!",
      "hint",
    );
  }

  // Trust framework
  if (component.id === "trust-framework") {
    return createCommentary(
      "Trust and transparency - that's brand new territory! Nobody's quite figured this out yet.",
      "hint",
    );
  }

  return null;
}

/**
 * Get commentary for classifying a component
 */
export function getClassificationCommentary(
  component: MapComponent,
  classification: ComponentClassification,
): Commentary | null {
  if (!classification) return null;

  const isCorrect = classification === component.correctClassification;

  // Correct classifications
  if (isCorrect) {
    switch (classification) {
      case "build":
        return createCommentary(
          "Great strategic thinking! Building this makes perfect sense.",
          "praise",
        );
      case "buy":
        return createCommentary(
          "Smart! Why reinvent the wheel when you can buy it off the shelf?",
          "praise",
        );
      case "repurpose":
        return createCommentary(
          "Brilliant! Reusing existing systems - that's reindeer efficiency right there!",
          "praise",
        );
    }
  }

  // Incorrect classifications - gentle hints
  if (!isCorrect) {
    if (
      component.correctClassification === "buy" &&
      classification === "build"
    ) {
      return createCommentary(
        "Hmm, are you sure you want to build that? Might be faster to buy it...",
        "correction",
      );
    }

    if (
      component.correctClassification === "build" &&
      classification === "buy"
    ) {
      return createCommentary(
        "Can you really buy that off the shelf? Seems pretty unique to me...",
        "correction",
      );
    }
  }

  return null;
}

/**
 * Get commentary for creating a dependency
 */
export function getDependencyCommentary(
  fromComponent: MapComponent,
  toComponent: MapComponent,
): Commentary | null {
  // Check for logical dependencies
  const logicalPairs = [
    {
      from: "mince-pie-delivery",
      to: "delivery-routing",
      message: "Yes! Deliveries need routing!",
    },
    {
      from: "ai-recipe-generator",
      to: "foundational-ai",
      message: "Of course! AI recipes need AI models!",
    },
    {
      from: "cloud-compute",
      to: "network-comms",
      message: "Right! Cloud needs the network layer!",
    },
    {
      from: "orchestration-framework",
      to: "foundational-ai",
      message: "Good thinking! Orchestration relies on those AI models!",
    },
  ];

  const match = logicalPairs.find(
    (pair) =>
      (pair.from === fromComponent.id && pair.to === toComponent.id) ||
      (pair.from === toComponent.id && pair.to === fromComponent.id),
  );

  if (match) {
    return createCommentary(match.message, "praise");
  }

  return null;
}

/**
 * Get commentary for score milestones
 */
export function getScoreMilestoneCommentary(score: number): Commentary | null {
  if (score >= 90) {
    return createCommentary(
      "Outstanding! Your nose is glowing brighter than mine! ✨",
      "praise",
    );
  }

  if (score >= 75) {
    return createCommentary(
      "Excellent strategic thinking! You could lead the sleigh!",
      "praise",
    );
  }

  if (score >= 50) {
    return createCommentary(
      "Good progress! Keep refining those placements.",
      "hint",
    );
  }

  if (score >= 25) {
    return createCommentary(
      "You're getting the hang of it! Think about evolution and value.",
      "hint",
    );
  }

  return null;
}

/**
 * Get welcome commentary at game start
 */
export function getWelcomeCommentary(): Commentary {
  return createCommentary(
    "Ho ho hello! I'm Rudolph, and I'll be your guide to strategic mapping. Let's map out this mince pie operation!",
    "hint",
  );
}

/**
 * Get completion commentary
 */
export function getCompletionCommentary(score: number): Commentary {
  if (score >= 80) {
    return createCommentary(
      `Magnificent! Score: ${score}. You've earned your place at the North Pole strategy table! 🎄`,
      "praise",
    );
  }

  if (score >= 60) {
    return createCommentary(
      `Well done! Score: ${score}. That's solid strategic thinking!`,
      "praise",
    );
  }

  return createCommentary(
    `Nice effort! Score: ${score}. Want to try refining your strategy?`,
    "hint",
  );
}

/**
 * Easter egg for checking Jeff Bezos on naughty/nice list
 */
export function getJeffBezosEasterEgg(): Commentary {
  return createCommentary(
    "Checking Jeff Bezos on the naughty/nice list... 🎅 Still deliberating on that one!",
    "easter-egg",
  );
}

/**
 * Random encouragement commentary
 */
const ENCOURAGEMENT_MESSAGES = [
  "Think about the evolution axis - how mature is this technology?",
  "Consider the value chain - how visible is this to customers?",
  "Remember: Build the novel, buy the commodity!",
  "Dependencies flow upward - from infrastructure to value!",
  'Patch says: "Don\'t forget to connect related components!"',
];

export function getRandomEncouragement(): Commentary {
  const message =
    ENCOURAGEMENT_MESSAGES[
      Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)
    ];
  return createCommentary(message, "hint");
}
