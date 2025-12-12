/**
 * Character components for Rudolph and Patch with commentary display
 */

import { useEffect, useState } from "react";
import type { Commentary } from "../types/game.types";

interface CharactersProps {
  commentary: Commentary[];
  onJeffBezosEasterEgg: () => void;
}

export default function Characters({
  commentary,
  onJeffBezosEasterEgg,
}: CharactersProps) {
  const [currentCommentary, setCurrentCommentary] = useState<Commentary | null>(
    null
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [bezosClicks, setBezosClicks] = useState(0);

  // Update current commentary when new commentary is added
  useEffect(() => {
    if (commentary.length === 0) return;

    const latest = commentary[commentary.length - 1];

    // Only update if it's a new commentary
    if (!currentCommentary || latest.id !== currentCommentary.id) {
      // This setState is intentional - we're synchronizing local display state with prop changes
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentCommentary(latest);
      setIsAnimating(true);

      // Auto-hide after 8 seconds for hints, keep praise longer
      const timeout = latest.type === "praise" ? 10000 : 8000;
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, timeout);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [commentary, currentCommentary]);

  const handleRudolphClick = (): void => {
    const newClicks = bezosClicks + 1;
    setBezosClicks(newClicks);

    if (newClicks === 3) {
      onJeffBezosEasterEgg();
      setBezosClicks(0);
    }
  };

  const getCommentaryBubbleColor = (type: Commentary["type"]): string => {
    switch (type) {
      case "praise":
        return "bg-christmas-green text-white border-transparent!";
      case "correction":
        return "bg-christmas-gold border-transparent!";
      case "easter-egg":
        return "bg-christmas-red text-white border-transparent!";
      default:
        return "bg-christmas-green-light border-christmas-green!";
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-end gap-4">
      {/* Rudolph character */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={handleRudolphClick}
          className="text-6xl hover:scale-110 transition-transform cursor-pointer"
          title="Rudolph - Your strategy guide"
        >
          🦌
        </button>
        <div className="text-sm font-semibold text-christmas-red mt-1">
          Rudolph
        </div>
      </div>

      {/* Patch character */}
      <div className="flex flex-col items-center">
        <div className="text-5xl">🧝</div>
        <div className="text-sm font-semibold text-christmas-green mt-1">
          Patch
        </div>
      </div>

      {/* Commentary bubble */}
      {currentCommentary && isAnimating && (
        <div
          className={`
            relative
            max-w-md
            p-4
            rounded-lg
            shadow-xl
            border-2
            border-gray-300
            ${getCommentaryBubbleColor(currentCommentary.type)}
            animate-slide-in-left
          `}
          style={{
            animation: "slideInLeft 1s ease-out",
          }}
        >
          <div className="text-sm font-medium">{currentCommentary.text}</div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsAnimating(false)}
            className="absolute cursor-pointer top-1 right-2 hover:text-gray-200 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
