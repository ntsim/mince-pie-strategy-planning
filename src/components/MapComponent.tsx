/**
 * Individual draggable component that can be placed on the strategy map
 */

import type { DragEvent } from "react";
import type {
  ComponentClassification,
  MapComponent as MapComponentType,
} from "../types/game.types";

interface MapComponentProps {
  component: MapComponentType;
  isSelected: boolean;
  isDragging: boolean;
  onClassificationChange: (classification: ComponentClassification) => void;
  onDragStart: (componentId: string) => void;
  onDragEnd: () => void;
  onClick: (componentId: string) => void;
}

export default function MapComponent({
  component,
  isSelected,
  isDragging,
  onClassificationChange,
  onDragStart,
  onDragEnd,
  onClick,
}: MapComponentProps) {
  const handleDragStart = (e: DragEvent<HTMLDivElement>): void => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("componentId", component.id);
    onDragStart(component.id);
  };

  const handleDragEnd = (): void => {
    onDragEnd();
  };

  const handleClick = (): void => {
    onClick(component.id);
  };

  const getClassificationColor = (
    classification: ComponentClassification,
    isPlaced: boolean
  ): string => {
    if (!isPlaced) {
      // Festive gradient for unplaced components
      return "bg-gradient-to-br from-christmas-red/20 to-christmas-green/20 border-christmas-green/60";
    }

    switch (classification) {
      case "build":
        return "bg-christmas-gold-light";
      case "buy":
        return "bg-winter-blue-light";
      case "repurpose":
        return "bg-christmas-green-light";
      default:
        return "bg-white border-christmas-green";
    }
  };

  const getClassificationIcon = (
    classification: ComponentClassification
  ): string => {
    switch (classification) {
      case "build":
        return "🔨";
      case "buy":
        return "🛒";
      case "repurpose":
        return "♻️";
      default:
        return "❓";
    }
  };

  return (
    <div
      className={`
        relative
        rounded-lg
        border
        p-3
        shadow-md
        transition-all
        duration-200
        cursor-grab
        active:cursor-grabbing
        ${isDragging ? "opacity-50 scale-95" : "opacity-100 scale-100"}
        ${isSelected ? "border-christmas-red border-2 shadow-xl" : component.isPlaced ? "border-gray-300" : ""}
        ${getClassificationColor(component.classification, component.isPlaced)}
        hover:shadow-lg
        hover:scale-105
      `}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      style={{
        minWidth: "180px",
        maxWidth: "200px",
      }}
    >
      {/* Component name */}
      <div className="font-semibold text-xs text-gray-900">
        {component.name}
      </div>

      {/* Component description */}
      <div className="text-[12px] text-gray-500 mt-1 mb-2">
        {component.description}
      </div>

      {/* Classification indicator */}
      {component.classification && (
        <div className="absolute -top-2 -right-2 rounded-full bg-white flex items-center justify-center size-7 border-gray-300 border-2">
          {getClassificationIcon(component.classification)}
        </div>
      )}

      {/* Classification buttons */}
      {component.isPlaced && (
        <div className="flex gap-1 mt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClassificationChange("build");
            }}
            className={`
              cursor-pointer
              border border-gray-200
              flex-1 text-xs py-1 px-2 rounded
              transition-colors
              ${
                component.classification === "build"
                  ? "bg-christmas-gold text-white font-bold border-transparent"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }
            `}
            title="Build - Novel solution"
          >
            Build
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClassificationChange("buy");
            }}
            className={`
              cursor-pointer
              border border-gray-200
              flex-1 text-xs py-1 px-2 rounded
              transition-colors
              ${
                component.classification === "buy"
                  ? "bg-winter-blue text-white font-bold border-transparent"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }
            `}
            title="Buy - Commodity/off-the-shelf"
          >
            Buy
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClassificationChange("repurpose");
            }}
            className={`
              cursor-pointer
              border border-gray-200
              flex-1 text-xs py-1 px-2 rounded
              transition-colors
              ${
                component.classification === "repurpose"
                  ? "bg-christmas-green text-white font-bold border-transparent"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }
            `}
            title="Repurpose - Existing system"
          >
            Reuse
          </button>
        </div>
      )}
    </div>
  );
}
