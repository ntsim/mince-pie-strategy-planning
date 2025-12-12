/**
 * Main strategy canvas component with drag-and-drop functionality
 */

import type { DragEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type {
  ComponentClassification,
  Dependency,
  MapComponent as MapComponentType,
  Position,
} from "../types/game.types";
import { EVOLUTION_STAGES } from "../utils/gameData";
import DependencyLines from "./DependencyLines";
import MapComponent from "./MapComponent";

interface StrategyCanvasProps {
  components: MapComponentType[];
  dependencies: Dependency[];
  selectedComponentId: string | null;
  pendingDependencyFromId: string | null;
  onComponentPlace: (componentId: string, position: Position) => void;
  onClassificationChange: (
    componentId: string,
    classification: ComponentClassification
  ) => void;
  onDependencyCreate: (fromId: string, toId: string) => void;
  onComponentSelect: (componentId: string | null) => void;
  onPendingDependencySet: (componentId: string | null) => void;
}

export default function StrategyCanvas({
  components,
  dependencies,
  selectedComponentId,
  pendingDependencyFromId,
  onComponentPlace,
  onClassificationChange,
  onDependencyCreate,
  onComponentSelect,
  onPendingDependencySet,
}: StrategyCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedComponentId, setDraggedComponentId] = useState<string | null>(
    null
  );
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Update canvas dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = (): void => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();

    const componentId = e.dataTransfer.getData("componentId");
    if (!componentId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp values to 0-100
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    onComponentPlace(componentId, { x: clampedX, y: clampedY });
    setDraggedComponentId(null);
  };

  const handleComponentClick = (componentId: string): void => {
    // If we're creating a dependency
    if (pendingDependencyFromId) {
      if (pendingDependencyFromId !== componentId) {
        onDependencyCreate(pendingDependencyFromId, componentId);
      }
      onPendingDependencySet(null);
      onComponentSelect(null);
    } else {
      // Regular selection
      onComponentSelect(
        componentId === selectedComponentId ? null : componentId
      );
    }
  };

  const handleCanvasClick = (e: MouseEvent<HTMLDivElement>): void => {
    // Only deselect if clicking directly on canvas, not on components
    if (e.target === e.currentTarget) {
      onComponentSelect(null);
      onPendingDependencySet(null);
    }
  };

  const unplacedComponents = components.filter((c) => !c.isPlaced);
  const placedComponents = components.filter((c) => c.isPlaced);

  return (
    <div className="flex gap-4 h-full">
      {/* Sidebar with unplaced components */}
      <div className=" bg-white rounded-lg shadow-lg p-4 border-christmas-green overflow-y-auto">
        <h2 className="text-lg font-bold text-christmas-green mb-4">
          Components to Place
        </h2>

        <div className="space-y-3">
          {unplacedComponents.map((component) => (
            <MapComponent
              key={component.id}
              component={component}
              isSelected={component.id === selectedComponentId}
              isDragging={component.id === draggedComponentId}
              onClassificationChange={(classification) =>
                onClassificationChange(component.id, classification)
              }
              onDragStart={(id) => setDraggedComponentId(id)}
              onDragEnd={() => setDraggedComponentId(null)}
              onClick={handleComponentClick}
            />
          ))}
        </div>

        {unplacedComponents.length === 0 && (
          <div className="text-center text-sm text-gray-500 mt-4">
            All components placed!
          </div>
        )}
      </div>

      {/* Main canvas */}
      <div className="flex-1 flex flex-col">
        {/* Canvas header with instructions */}
        <div className="rounded-t-lg shadow-lg bg-christmas-green-light py-2">
          <div className="text-center">
            <div className="text-xs text-christmas-green">
              {pendingDependencyFromId
                ? "Click another component to create a dependency"
                : "Drag components onto the map, classify them, and draw connections"}
            </div>
          </div>
        </div>

        {/* Canvas area */}
        <div
          ref={canvasRef}
          className="flex-1 relative bg-gradient-to-br from-sky-50 to-blue-50 rounded-b-lg shadow-lg"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleCanvasClick}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Vertical lines for evolution stages */}
            {EVOLUTION_STAGES.map((stage) => (
              <div
                key={stage.key}
                className="absolute top-0 bottom-0 border-l border-gray-300 border-dashed"
                style={{ left: `${stage.xRange[0]}%` }}
              />
            ))}

            {/* Horizontal lines for value chain */}
            {[25, 50, 75].map((y) => (
              <div
                key={y}
                className="absolute left-0 right-0 border-t border-gray-300 border-dashed"
                style={{ top: `${y}%` }}
              />
            ))}
          </div>

          {/* Y-axis label */}
          <div className="absolute -left-11 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
            <div className="text-xs font-semibold text-gray-600 whitespace-nowrap">
              Value Chain (Visibility)
            </div>
          </div>

          {/* Y-axis markers */}
          <div className="absolute left-3 top-8 -rotate-90 origin-left text-xs font-medium text-gray-600 whitespace-nowrap">
            Visible
          </div>
          <div className="absolute left-3 bottom-4 -rotate-90 origin-left text-xs font-medium text-gray-600 whitespace-nowrap">
            Invisible
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-2 left-0 right-0 flex">
            {EVOLUTION_STAGES.map((stage) => (
              <div
                key={stage.key}
                className="text-center text-xs font-medium text-gray-700"
                style={{
                  width: `${stage.xRange[1] - stage.xRange[0]}%`,
                  marginLeft: stage.xRange[0] === 0 ? "0" : undefined,
                }}
              >
                <div className="font-bold">{stage.label}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  {stage.description}
                </div>
              </div>
            ))}
          </div>

          {/* Dependency lines */}
          <DependencyLines
            dependencies={dependencies}
            components={components}
            canvasWidth={canvasDimensions.width}
            canvasHeight={canvasDimensions.height}
          />

          {/* Placed components */}
          {placedComponents.map((component) => {
            if (!component.position) return null;

            return (
              <div
                key={component.id}
                className="absolute"
                style={{
                  left: `${component.position.x}%`,
                  top: `${component.position.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: component.id === selectedComponentId ? 10 : 5,
                }}
              >
                <MapComponent
                  component={component}
                  isSelected={component.id === selectedComponentId}
                  isDragging={component.id === draggedComponentId}
                  onClassificationChange={(classification) =>
                    onClassificationChange(component.id, classification)
                  }
                  onDragStart={(id) => setDraggedComponentId(id)}
                  onDragEnd={() => setDraggedComponentId(null)}
                  onClick={handleComponentClick}
                />
              </div>
            );
          })}

          {/* Pending dependency indicator */}
          {pendingDependencyFromId && (
            <div className="absolute -top-4 right-4 bg-christmas-gold text-gray-900 px-4 py-3 rounded-lg shadow-lg animate-pulse">
              <div className="font-semibold">Creating Dependency...</div>
              <div className="text-xs mt-1">
                Click another component to connect
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 bg-white rounded-lg shadow-lg p-4 border-2 border-gray-300">
          <div className="flex gap-3 items-center">
            <button
              type="button"
              onClick={() => {
                if (selectedComponentId) {
                  onPendingDependencySet(selectedComponentId);
                }
              }}
              disabled={!selectedComponentId}
              className="
              cursor-pointer
                px-4 py-2
                bg-christmas-green
                text-white
                font-semibold
                rounded-lg
                disabled:bg-gray-300
                disabled:cursor-not-allowed
                hover:bg-green-800
                transition-colors
              "
            >
              Create Dependency
            </button>

            <div className="text-sm text-gray-600">
              {selectedComponentId
                ? 'Selected component. Click "Create Dependency" then click another component to connect them.'
                : "Select a component to create dependencies between components."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
