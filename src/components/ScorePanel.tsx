/**
 * Score panel displaying current score and earned badges
 */

import type { Badge } from "../types/game.types";

interface ScorePanelProps {
  score: number;
  badges: Badge[];
  onComplete: () => void;
  allComponentsPlaced: boolean;
}

export default function ScorePanel({
  score,
  badges,
  onComplete,
  allComponentsPlaced,
}: ScorePanelProps) {
  const earnedBadges = badges.filter((b) => b.earned);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-christmas-green";
    if (score >= 60) return "text-christmas-gold";
    if (score >= 40) return "text-winter-blue";
    return "text-gray-600";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 90) return "Exceptional!";
    if (score >= 80) return "Excellent!";
    if (score >= 70) return "Very Good!";
    if (score >= 60) return "Good Progress!";
    if (score >= 50) return "Getting There!";
    if (score >= 30) return "Keep Going!";
    return "Just Started!";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-40 border-christmas-red">
      {/* Score display */}
      <div className="text-center mb-4">
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
          Nose Glow Score
        </div>
        <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
          {score}
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${score}%`,
              background: `linear-gradient(to right,
                #fbbf24 0%,
                #f97316 ${score > 50 ? '50%' : '100%'},
                #dc2626 100%)`
            }}
          />
        </div>

        <div className="text-xs font-medium text-gray-500 mt-2">
          {getScoreLabel(score)}
        </div>
      </div>

      {/* Badges section */}
      <div className="border-t-2 border-gray-200 pt-4">
        <div className="text-sm font-semibold text-gray-700 mb-3">
          Wisdom Badges ({earnedBadges.length}/{badges.length})
        </div>

        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`
                flex flex-row items-center
                p-2
                rounded-lg
                border-2
                transition-all
                ${
                  badge.earned
                    ? "bg-christmas-gold border-christmas-gold shadow-md"
                    : "bg-gray-100 border-gray-300 opacity-50"
                }
              `}
              title={badge.description}
            >
              <div className="text-2xl mr-2">
                {badge.earned ? badge.icon : "🔒"}
              </div>
              <div className="text-xs font-medium text-gray-900">
                {badge.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complete button */}
      {allComponentsPlaced && (
        <button
          type="button"
          onClick={onComplete}
          className="
            w-full
            mt-6
            py-3
            px-4
            bg-christmas-red
            text-white
            font-bold
            rounded-lg
            hover:bg-red-700
            transition-colors
            shadow-md
            hover:shadow-lg
          "
        >
          View Certificate
        </button>
      )}

      {/* Progress indicator */}
      {!allComponentsPlaced && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Place all components to unlock certificate
        </div>
      )}
    </div>
  );
}
