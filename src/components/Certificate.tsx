/**
 * Shareable certificate component for game completion
 */

import { useRef } from "react";
import type { Badge } from "../types/game.types";

interface CertificateProps {
  score: number;
  badges: Badge[];
  onClose: () => void;
  onRestart: () => void;
}

export default function Certificate({
  score,
  badges,
  onClose,
  onRestart,
}: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const earnedBadges = badges.filter((b) => b.earned);

  const handleDownload = async (): Promise<void> => {
    if (!certificateRef.current) return;

    try {
      // Note: For actual image download, we would use html2canvas or similar library
      // For now, we'll just show an alert
      alert(
        "Certificate download would be implemented with html2canvas library",
      );
    } catch (error) {
      console.error("Failed to download certificate:", error);
    }
  };

  const handleCopyText = (): void => {
    const text = `
🎄 North Pole Strategy Certificate 🎄

I successfully completed the Christmas Strategic Mapping Challenge!

Strategic Clarity Score: ${score}/100
Badges Earned: ${earnedBadges.length}/${badges.length}

${earnedBadges.map((b) => `${b.icon} ${b.name}`).join("\n")}

Date: ${new Date().toLocaleDateString()}

#NorthPoleStrategy #WardleyMapping #StrategicThinking
    `.trim();

    navigator.clipboard.writeText(text);
    alert("Certificate text copied to clipboard!");
  };

  const getPerformanceLevel = (score: number): string => {
    if (score >= 90) return "Outstanding Strategic Excellence";
    if (score >= 80) return "Excellent Strategic Thinking";
    if (score >= 70) return "Strong Strategic Understanding";
    if (score >= 60) return "Good Strategic Awareness";
    return "Strategic Participation";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Certificate content */}
        <div
          ref={certificateRef}
          className="p-8 bg-gradient-to-br from-snow-white via-white to-sky-50"
        >
          {/* Decorative header */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎄</div>
            <h1 className="text-4xl font-bold text-christmas-red mb-2">
              North Pole Strategy Certificate
            </h1>
            <div className="text-sm text-gray-600 italic">
              "Craving pies, Christmas pies, feeling cosy by a fire..."
            </div>
          </div>

          {/* Certificate body */}
          <div className="border-4 border-christmas-gold rounded-lg p-6 bg-white shadow-inner">
            <div className="text-center mb-6">
              <div className="text-lg font-semibold text-gray-700 mb-2">
                This certifies that
              </div>
              <div className="text-3xl font-bold text-christmas-green mb-4">
                You
              </div>
              <div className="text-base text-gray-700 mb-4">
                have successfully completed the Christmas Strategic Mapping
                Challenge and demonstrated
              </div>
              <div className="text-2xl font-bold text-winter-blue mb-4">
                {getPerformanceLevel(score)}
              </div>
            </div>

            {/* Score display */}
            <div className="text-center mb-6 py-4 bg-gradient-to-r from-christmas-red to-christmas-green rounded-lg">
              <div className="text-sm font-semibold text-white uppercase tracking-wide mb-1">
                Strategic Clarity Score
              </div>
              <div className="text-6xl font-bold text-christmas-gold">
                {score}
              </div>
            </div>

            {/* Badges earned */}
            <div className="mb-6">
              <div className="text-center text-sm font-semibold text-gray-700 mb-3">
                Wisdom Badges Earned ({earnedBadges.length}/{badges.length})
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 bg-christmas-gold px-3 py-2 rounded-full shadow-md"
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date and signatures */}
            <div className="flex justify-between items-end text-sm text-gray-600 mt-8 pt-4 border-t-2 border-gray-200">
              <div>
                <div className="font-semibold mb-1">Date</div>
                <div>
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl mb-1">🦌</div>
                <div className="font-semibold">Rudolph</div>
                <div className="text-xs">Chief Strategy Officer</div>
              </div>
            </div>
          </div>

          {/* Decorative footer */}
          <div className="text-center mt-6 text-xs text-gray-500">
            North Pole Strategic Planning Division • Christmas 2025
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-6 bg-gray-50 border-t-2 border-gray-200 flex gap-3">
          <button
            type="button"
            onClick={handleCopyText}
            className="
              flex-1
              py-2
              px-4
              bg-winter-blue
              text-white
              font-semibold
              rounded-lg
              hover:bg-blue-700
              transition-colors
            "
          >
            Copy Text
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="
              flex-1
              py-2
              px-4
              bg-christmas-green
              text-white
              font-semibold
              rounded-lg
              hover:bg-green-800
              transition-colors
            "
          >
            Download
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="
              flex-1
              py-2
              px-4
              bg-christmas-gold
              text-gray-900
              font-semibold
              rounded-lg
              hover:bg-yellow-600
              transition-colors
            "
          >
            Play Again
          </button>
          <button
            type="button"
            onClick={onClose}
            className="
              py-2
              px-6
              bg-gray-200
              text-gray-700
              font-semibold
              rounded-lg
              hover:bg-gray-300
              transition-colors
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
