/**
 * SVG component for drawing dependency lines between components
 */

import type { Dependency, MapComponent } from "../types/game.types";

interface DependencyLinesProps {
  dependencies: Dependency[];
  components: MapComponent[];
  canvasWidth: number;
  canvasHeight: number;
}

// Card dimensions based on MapComponent.tsx
const CARD_WIDTH = 190; // Average of minWidth (180px) and maxWidth (200px)
const CARD_HEIGHT = 120; // Estimated based on component content
const ARROWHEAD_LENGTH = 10; // Length of the arrowhead in pixels

export default function DependencyLines({
  dependencies,
  components,
  canvasWidth,
  canvasHeight,
}: DependencyLinesProps) {
  /**
   * Get the center position of a component on the canvas
   */
  const getComponentCenter = (
    componentId: string
  ): { x: number; y: number } | null => {
    const component = components.find((c) => c.id === componentId);
    if (!component || !component.position) {
      return null;
    }

    // Convert percentage position to pixel position
    const x = (component.position.x / 100) * canvasWidth;
    const y = (component.position.y / 100) * canvasHeight;

    return { x, y };
  };

  /**
   * Calculate the intersection point between a line from source to target center
   * and the edge of the target card's bounding box, offset by arrowhead length
   */
  const getEdgeIntersection = (
    fromPoint: { x: number; y: number },
    toPoint: { x: number; y: number }
  ): { x: number; y: number } => {
    // Calculate the direction vector from source to target
    const dx = toPoint.x - fromPoint.x;
    const dy = toPoint.y - fromPoint.y;

    // Calculate angle from source to target
    const angle = Math.atan2(dy, dx);

    // Half dimensions of the target card
    const halfWidth = CARD_WIDTH / 2;
    const halfHeight = CARD_HEIGHT / 2;

    // Calculate intersection with rectangle edges
    // We need to find which edge the line intersects first
    const absAngle = Math.abs(angle);
    const cardAspectRatio = Math.atan2(halfHeight, halfWidth);

    let intersectX: number;
    let intersectY: number;

    // Determine which edge is hit based on angle
    if (absAngle < cardAspectRatio) {
      // Right edge
      intersectX = toPoint.x - halfWidth;
      intersectY = toPoint.y - halfWidth * Math.tan(angle);
    } else if (absAngle > Math.PI - cardAspectRatio) {
      // Left edge
      intersectX = toPoint.x + halfWidth;
      intersectY = toPoint.y + halfWidth * Math.tan(angle);
    } else if (angle > 0) {
      // Bottom edge
      intersectY = toPoint.y - halfHeight;
      intersectX = toPoint.x - halfHeight / Math.tan(angle);
    } else {
      // Top edge
      intersectY = toPoint.y + halfHeight;
      intersectX = toPoint.x - halfHeight / Math.tan(angle);
    }

    // Offset the intersection point by the arrowhead length
    // Move back along the line direction so the arrow tip touches the edge
    const lineLength = Math.sqrt(dx * dx + dy * dy);
    const unitDx = dx / lineLength;
    const unitDy = dy / lineLength;

    return {
      x: intersectX - unitDx * ARROWHEAD_LENGTH,
      y: intersectY - unitDy * ARROWHEAD_LENGTH,
    };
  };

  /**
   * Create an SVG path between two points with a smooth curve
   */
  const createPath = (
    from: { x: number; y: number },
    to: { x: number; y: number }
  ): string => {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;

    // Create a quadratic bezier curve for a smooth connection
    return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
  };

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={canvasWidth}
      height={canvasHeight}
      style={{ zIndex: 1 }}
    >
      <defs>
        {/* Arrow marker for dependency direction */}
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="10"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#165B33" />
        </marker>
      </defs>

      {dependencies.map((dependency) => {
        const fromPos = getComponentCenter(dependency.fromComponentId);
        const toCenter = getComponentCenter(dependency.toComponentId);

        if (!fromPos || !toCenter) {
          return null;
        }

        // Calculate the edge intersection point for the target
        const toPos = getEdgeIntersection(fromPos, toCenter);

        const path = createPath(fromPos, toPos);

        return (
          <g key={dependency.id}>
            {/* Thicker invisible line for easier hover interaction */}
            <path
              d={path}
              stroke="transparent"
              strokeWidth="12"
              fill="none"
              className="pointer-events-auto cursor-pointer"
            />

            {/* Visible line */}
            <path
              d={path}
              stroke="#165B33"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              opacity="1"
              markerEnd="url(#arrowhead)"
              className="pointer-events-auto cursor-pointer transition-all hover:opacity-100 hover:stroke-christmas-red"
            />
          </g>
        );
      })}
    </svg>
  );
}
