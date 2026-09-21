import React from 'react';

// Minimal magnolia flower SVG that "blooms" via the bloom animation.
export default function MagnoliaFlower({ className = '' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g className="origin-center animate-bloom">
        {[0, 60, 120, 180, 240, 300].map((rot) => (
          <ellipse
            key={rot}
            cx="50"
            cy="28"
            rx="11"
            ry="22"
            transform={`rotate(${rot} 50 50)`}
            fill="hsl(var(--accent) / 0.18)"
            stroke="hsl(var(--accent))"
            strokeWidth="0.6"
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="6" fill="hsl(var(--primary) / 0.5)" />
    </svg>
  );
}