/**
 * Main App component - North Pole Strategy Game
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Certificate from "./components/Certificate";
import Characters from "./components/Characters";
import ScorePanel from "./components/ScorePanel";
import StrategyCanvas from "./components/StrategyCanvas";
import type {
  Commentary,
  ComponentClassification,
  Dependency,
  MapComponent,
  Position,
} from "./types/game.types";
import {
  getClassificationCommentary,
  getCompletionCommentary,
  getDependencyCommentary,
  getJeffBezosEasterEgg,
  getPlacementCommentary,
  getScoreMilestoneCommentary,
  getWelcomeCommentary,
} from "./utils/commentary";
import { INITIAL_BADGES, INITIAL_COMPONENTS } from "./utils/gameData";
import { calculateTotalScore, checkBadgeEarned } from "./utils/scoring";

function App() {
  const [components, setComponents] =
    useState<MapComponent[]>(INITIAL_COMPONENTS);
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [commentary, setCommentary] = useState<Commentary[]>([
    getWelcomeCommentary(),
  ]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );
  const [pendingDependencyFromId, setPendingDependencyFromId] = useState<
    string | null
  >(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [lastScore, setLastScore] = useState(0);

  // Calculate score (derived state)
  const score = useMemo(
    () => calculateTotalScore(components, dependencies),
    [components, dependencies]
  );

  // Calculate badges (derived state)
  const badges = useMemo(
    () =>
      INITIAL_BADGES.map((badge) => ({
        ...badge,
        earned: checkBadgeEarned(badge.id, components, dependencies),
      })),
    [components, dependencies]
  );

  const addCommentary = useCallback((newCommentary: Commentary): void => {
    setCommentary((prev) => [...prev, newCommentary]);
  }, []);

  // Check for score milestones
  useEffect(() => {
    if (score > lastScore && score % 25 === 0 && score > 0) {
      const milestoneCommentary = getScoreMilestoneCommentary(score);
      if (milestoneCommentary) {
        // This setState is intentional - we're synchronizing external state (commentary) with score changes
        // eslint-disable-next-line react-hooks/set-state-in-effect
        addCommentary(milestoneCommentary);
      }
    }
    setLastScore(score);
  }, [score, lastScore, addCommentary]);

  const handleComponentPlace = (
    componentId: string,
    position: Position
  ): void => {
    const component = components.find((c) => c.id === componentId);
    if (!component) return;

    setComponents((prev) =>
      prev.map((c) =>
        c.id === componentId ? { ...c, position, isPlaced: true } : c
      )
    );

    // Add placement commentary
    const placementCommentary = getPlacementCommentary(component);
    if (placementCommentary) {
      addCommentary(placementCommentary);
    }
  };

  const handleClassificationChange = (
    componentId: string,
    classification: ComponentClassification
  ): void => {
    const component = components.find((c) => c.id === componentId);
    if (!component) return;

    setComponents((prev) =>
      prev.map((c) => (c.id === componentId ? { ...c, classification } : c))
    );

    // Add classification commentary
    const classificationCommentary = getClassificationCommentary(
      component,
      classification
    );
    if (classificationCommentary) {
      addCommentary(classificationCommentary);
    }
  };

  const handleDependencyCreate = (fromId: string, toId: string): void => {
    // Check if dependency already exists
    const exists = dependencies.some(
      (d) =>
        (d.fromComponentId === fromId && d.toComponentId === toId) ||
        (d.fromComponentId === toId && d.toComponentId === fromId)
    );

    if (exists) return;

    const newDependency: Dependency = {
      id: `dep-${Date.now()}`,
      fromComponentId: fromId,
      toComponentId: toId,
    };

    setDependencies((prev) => [...prev, newDependency]);

    // Add dependency commentary
    const fromComponent = components.find((c) => c.id === fromId);
    const toComponent = components.find((c) => c.id === toId);

    if (fromComponent && toComponent) {
      const dependencyCommentary = getDependencyCommentary(
        fromComponent,
        toComponent
      );
      if (dependencyCommentary) {
        addCommentary(dependencyCommentary);
      }
    }
  };

  const handleComponentSelect = (componentId: string | null): void => {
    setSelectedComponentId(componentId);
  };

  const handlePendingDependencySet = (componentId: string | null): void => {
    setPendingDependencyFromId(componentId);
  };

  const handleComplete = (): void => {
    const completionCommentary = getCompletionCommentary(score);
    addCommentary(completionCommentary);
    setShowCertificate(true);
  };

  const handleRestart = (): void => {
    setComponents(INITIAL_COMPONENTS);
    setDependencies([]);
    setCommentary([getWelcomeCommentary()]);
    setSelectedComponentId(null);
    setPendingDependencyFromId(null);
    setShowCertificate(false);
    setLastScore(0);
  };

  const handleJeffBezosEasterEgg = (): void => {
    addCommentary(getJeffBezosEasterEgg());
  };

  const allComponentsPlaced = components.every((c) => c.isPlaced);

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-5xl font-bold text-christmas-red mb-2">
            🎄 Mince Pie Maker Planning 🎄
          </h1>
          <p className="text-lg text-gray-700">
            Map your AI-powered Christmas mince pie making app using Wardley
            Mapping principles
          </p>
        </header>

        {/* Main game area */}
        <div className="flex gap-6" style={{ height: "calc(100vh - 240px)" }}>
          {/* Canvas area */}
          <div className="flex-1">
            <StrategyCanvas
              components={components}
              dependencies={dependencies}
              selectedComponentId={selectedComponentId}
              pendingDependencyFromId={pendingDependencyFromId}
              onComponentPlace={handleComponentPlace}
              onClassificationChange={handleClassificationChange}
              onDependencyCreate={handleDependencyCreate}
              onComponentSelect={handleComponentSelect}
              onPendingDependencySet={handlePendingDependencySet}
            />
          </div>

          {/* Score panel */}
          <ScorePanel
            score={score}
            badges={badges}
            onComplete={handleComplete}
            allComponentsPlaced={allComponentsPlaced}
          />
        </div>

        {/* Characters */}
        <Characters
          commentary={commentary}
          onJeffBezosEasterEgg={handleJeffBezosEasterEgg}
        />

        {/* Certificate modal */}
        {showCertificate && (
          <Certificate
            score={score}
            badges={badges}
            onClose={() => setShowCertificate(false)}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}

export default App;
