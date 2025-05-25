import { useState, useEffect } from 'react';
import { UseSignInUp } from '../Hooks/UseSignInUp';

export default function SignUpPage() {
  const [visible, setVisible] = useState(false);
  const { signInUp, isLoading, error } = UseSignInUp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    birthDate: ''
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
    await signInUp(formData, "signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 text-gold relative overflow-hidden font-serif">
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
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-6 max-w-xl mx-auto transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div style={{
          maxWidth: '400px',
          margin: '0 auto',
          padding: '2rem',
          background: 'rgba(30, 22, 60, 0.85)',
          borderRadius: '1.5rem',
          boxShadow: '0 4px 24px 0 #0008',
          border: '1.5px solid #e6c47a',
          backdropFilter: 'blur(2px)',
        }}>
          <h1 style={{
            color: "#e6c47a",
            fontFamily: "'IM Fell English SC', serif",
            fontSize: "2.5rem",
            textAlign: "center",
            marginBottom: "1.5rem",
            textShadow: "0 2px 8px #000a"
          }}>
            Sign Up
          </h1>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: "#e6c47a" }}>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: 'solid 1px #e6c47a',
                  borderRadius: '8px',
                  background: '#2e2150',
                  color: '#fff'
                }}
              />
            </div>
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
                  background: '#2e2150',
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
                    background: '#2e2150',
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
            <div style={{
              marginBottom: '1rem',
              display: 'flex',
              gap: '1rem'
            }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: "#e6c47a" }}>Gender:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  defaultValue={formData.gender}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: 'solid 1px #e6c47a',
                    borderRadius: '8px',
                    background: '#2e2150',
                    color: '#fff'
                  }}
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: "#e6c47a" }}>Date of Birth:</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: 'solid 1px #e6c47a',
                    borderRadius: '8px',
                    background: '#2e2150',
                    color: '#fff'
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 1rem' }}>
              <button
                type="submit"
                style={{
                  color: "#fff",
                  background: "linear-gradient(90deg, #a78bfa 0%, #fbbf24 100%)",
                  fontWeight: "bold",
                  padding: "0.75rem 2rem",
                  borderRadius: "999px",
                  border: "none",
                  boxShadow: "0 2px 8px #0005",
                  fontSize: "1.1rem",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
              >
                Become a wizard
              </button>
            </div>
            {error && (
              <div style={{ color: "#ffb4b4", marginTop: "1rem", textAlign: "center" }}>
                {error}
              </div>
            )}
          </form>
        </div>
      </div>

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
      `}</style>
    </div>
  );
}