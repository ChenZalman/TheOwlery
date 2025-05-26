import { useState, useEffect } from "react";
import AboutUs from "./homePage/aboutUs";  

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [aboutUsOpen, setAboutUsOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen text-gold relative overflow-hidden font-serif" style={{backgroundColor:"#1D1E22"}}>
      <link
        href="https://fonts.googleapis.com/css2?family=Uncial+Antiqua&family=IM+Fell+English+SC&display=swap"
        rel="stylesheet"
      />

      {/* Floating particles */}
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

      {/* Magical sparkles */}
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

      {/* Main content */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-6 max-w-6xl mx-auto transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Owl and Title Section */}
        <div className="flex flex-col md:flex-row items-center justify-center mb-8 relative gap-8">
          {/* Owl with glowing circle behind */}
          <div className="relative w-[28rem] h-[28rem] flex items-center justify-center">
            {/* Glowing circle */}
             {/*<div className="absolute w-[22rem] h-[22rem] bg-amber-100 rounded-full opacity-20 animate-pulse"></div>

            {/* Owl */}
            <img
              src="/images/owl.png"
              alt="Flying Owl"
              className="w-[24rem] h-[24rem] animate-fly-loop drop-shadow-lg"
              style={{
                transformOrigin: "center",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
              }}
            />
          </div>

          {/* Title */}
          <div className="text-center md:text-left">
            <h1
              className="text-8xl md:text-9xl font-bold mb-2 bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg"
              style={{
                fontFamily: "'IM Fell English SC', serif",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                fontSize: "clamp(4rem, 12vw, 8rem)",
              }}
            >
              The Owlery
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-12 max-w-xl">
          <p className="text-lg md:text-xl font-semibold text-gold/90 px-4 py-2 rounded-lg shadow-lg">
            Where owls gossip, quills misbehave, and your spells might accidentally turn your diary into a toad.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center space-y-6">
        <button
        className="group px-12 py-5 bg-gradient-to-r from-yellow-700 to-silver-700 text-gold font-bold text-xl rounded-full border-2 border-gold/50 hover:border-gold hover:scale-110 hover:shadow-[0_0_30px_#e6c47a] transition-all duration-500 transform hover:-translate-y-1"
        onClick={() => setAboutUsOpen(true)}
        >
      <span className="flex items-center gap-3">
      About Us <span className="text-2xl group-hover:animate-spin">✨</span>
    </span>
   </button>

          <p className="text-gold/70 text-lg italic animate-pulse">
            Ready your quills and parchment
          </p>

          <div className="flex justify-center gap-4 text-gold/60 text-2xl">
            <span className="animate-bounce" style={{ animationDelay: "0s" }}>
              🪶
            </span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
              📜
            </span>
            <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
              
            </span>
          </div>
        </div>
      </div>
{aboutUsOpen && <AboutUs onClose={() => setAboutUsOpen(false)} />}
      {/* Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-15px) translateX(8px);
          }
          50% {
            transform: translateY(-8px) translateX(-5px);
          }
          75% {
            transform: translateY(-20px) translateX(3px);
          }
        }

        @keyframes fly-loop {
          0% {
            transform: rotate(0deg) translateX(60px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(60px) rotate(-360deg);
          }
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .animate-fly-loop {
          animation: fly-loop 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
