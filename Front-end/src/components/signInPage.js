import { useEffect, useMemo, useState } from "react";
import { UseSignInUp } from "../Hooks/UseSignInUp";

export default function SignInPage() {
  const [visible, setVisible] = useState(false);
  const { signInUp, isLoading, error } = UseSignInUp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    birthDate: "",
  });

  // For fade-in animation
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signInUp(formData, "signin");
  };

  const floatingParticles = useMemo(
    () => (
      <div className='absolute inset-0 pointer-events-none z-0'>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className='absolute w-2 h-2 bg-gold rounded-full opacity-30'
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

  const stars = useMemo(
    () => (
      <div className='absolute inset-0 pointer-events-none z-0'>
        {[...Array(8)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className='absolute text-gold text-xs opacity-60'
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
<div className='min-h-screen text-gold relative overflow-hidden font-serif' style={{ backgroundColor: "#1D1E22" }}>
      <link
        href='https://fonts.googleapis.com/css2?family=Uncial+Antiqua&family=IM+Fell+English+SC&display=swap'
        rel='stylesheet'
      />

      {stars}
      {floatingParticles}

      {/* Main content */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-6 max-w-xl mx-auto transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div
          style={{
            maxWidth: '400px',
            margin: '0 auto',
            padding: '2rem',
            background: 'rgba(34, 32, 40, 0.92)',
            borderRadius: '1.5rem',
            boxShadow: '0 4px 24px 0 #0008',
            border: '1.5px solid #e6c47a',
            backdropFilter: 'blur(2px)',
          }}
        >
          <h1
            style={{
              color: "#e6c47a",
              fontFamily: "'IM Fell English SC', serif",
              fontSize: "2.5rem",
              textAlign: "center",
              marginBottom: "1.5rem",
              textShadow: "0 2px 8px #000a",
            }}
          >
            Sign In
          </h1>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: "#e6c47a" }}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: 'solid 1px #e6c47a',
                  borderRadius: '8px',
                  background: '#23242a',
                  color: '#fff'
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: "#e6c47a" }}>Password:</label>
              <div style={{ display: 'flex', position: 'relative' }}>
                <input
                  type={visible ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: 'solid 1px #e6c47a',
                    borderRadius: '8px',
                    background: '#23242a',
                    color: '#fff'
                  }}
                />
                <img
                  src={visible ? "images/img_eye_on.svg" : "images/img_eye_off.svg"}
                  alt="Eye"
                  className="h-[24px] w-[24px]"
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer"
                  }}
                  onClick={() => { setVisible(!visible) }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 1rem' }}>
              <button
                type="submit"
                className="group px-12 py-5 bg-gradient-to-r from-yellow-700 to-slate-700 text-gold font-bold text-xl rounded-full border-2 border-gold/50 hover:border-gold hover:scale-110 hover:shadow-[0_0_30px_#e6c47a] transition-all duration-500 transform hover:-translate-y-1"
                style={{ outline: 'none' }}
              >
                <span className="flex items-center gap-3">
                  Welcome old wizard <span className="text-2xl group-hover:animate-spin">✨</span>
                </span>
              </button>
            </div>
            {error && <div style={{ color: "#ffb4b4", marginTop: "1rem", textAlign: "center" }}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
