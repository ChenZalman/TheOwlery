import { Link } from "react-router-dom";
import { useAuthContext } from "../Hooks/UseAuthContext";
import { useSignout } from "../Hooks/UseSignout";

export default function TopBanner() {
  const { user } = useAuthContext();
  const { signOut } = useSignout();

  const handleClick = () => {
    signOut();
  };

  return (
    <div className="relative z-20 w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 border-b-2 border-gold/50 shadow-lg">
      <div className="flex items-center justify-center gap-8 px-6 py-4 text-gold font-serif text-lg">
        <Link
          to="/"
          className="hover:text-yellow-300 transition duration-300 hover:underline"
        >
          Back to Main Station
        </Link>
        <Link
          to="/signinpage"
          className="hover:text-yellow-300 transition duration-300 hover:underline"
        >
          Welcome Wizard
        </Link>
        <Link
          to="/signuppage"
          className="hover:text-yellow-300 transition duration-300 hover:underline"
        >
          Become a Wizard
        </Link>
        <Link
          to="/notFoundPage"
          className="hover:text-yellow-300 transition duration-300 hover:underline"
        >
          Vanish to Nowhere
        </Link>
        <Link
          to="/post"
          className="hover:text-yellow-300 transition duration-300 hover:underline"
        >
          See a Post Demo
        </Link>
        {user && (
          <button
            onClick={handleClick}
            className="ml-4 px-4 py-2 border border-gold rounded-full text-gold hover:bg-gold/20 transition duration-300"
          >
            Sign Out
          </button>
        )}
      </div>

      {/* Optional Sparkle Layer (for top nav) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={`sparkle-nav-${i}`}
            className="absolute text-gold text-sm opacity-50"
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

      <style jsx="true">{`
        @keyframes sparkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
