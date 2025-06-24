import { useMemo } from "react";

const MainFeed = () => {
    // Floating particles and sparkles (like home page)
    const floatingParticles = useMemo(
        () => (
            <div className="absolute inset-0 pointer-events-none z-0">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-gold rounded-full opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                            boxShadow: "0 0 10px #e6c47a",
                        }}
                    ></div>
                ))}
            </div>
        ),
        []
    );
    const magicalSparkles = useMemo(
        () => (
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
        ),
        []
    );

    return (
        <div className="min-h-screen text-gold relative overflow-hidden font-serif" style={{ backgroundColor: "#1D1E22" }}>
            {magicalSparkles}
            {floatingParticles}
            {/* Main feed content goes here */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    25% { transform: translateY(-15px) translateX(8px); }
                    50% { transform: translateY(-8px) translateX(-5px); }
                    75% { transform: translateY(-20px) translateX(3px); }
                }
                @keyframes sparkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
            `}</style>
        </div>
    );
}
 
export default MainFeed;