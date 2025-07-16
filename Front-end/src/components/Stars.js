import { useMemo } from 'react';

const Stars = () => {
  const visualEffects = useMemo(
    () => (
      <>
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-gold rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                boxShadow: "0 0 10px #e6c47a",
              }}
            />
          ))}
        </div>
        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute text-gold text-xs opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `sparkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      </>
    ),
    []
  );

  return visualEffects;
};

export default Stars;
