import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function AuthBook() {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);

  /* ================= REGISTER STATE ================= */
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  /* ================= LOGIN STATE ================= */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  /* ================= FLIP ================= */

  const goLogin = () => {
    setFlipped(true);
    gsap.to(cardRef.current, {
      rotateY: 180,
      duration: 0.9,
      ease: "power3.inOut",
    });
    setMsg("");
  };

  const goRegister = () => {
    setFlipped(false);
    gsap.to(cardRef.current, {
      rotateY: 0,
      duration: 0.9,
      ease: "power3.inOut",
    });
    setMsg("");
  };

  /* ================= REGISTER ================= */

  const registerUser = async () => {
    if (!name || !regEmail || !regPassword) {
      setMsg("⚠️ Please fill all fields");
      return;
    }

    setLoading(true);
    setMsg("⏳ Registering...");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: regEmail,
          password: regPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMsg("✅ Registered successfully!");
      setTimeout(goLogin, 900);
    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGIN ================= */

  const loginUser = async () => {
    if (!loginEmail || !loginPassword) {
      setMsg("⚠️ Enter email & password");
      return;
    }

    setLoading(true);
    setMsg("⏳ Logging in...");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      setMsg("✅ Login successful");

      // save user
      localStorage.setItem("user", JSON.stringify(data.user));

      // redirect to home
      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="auth-scene">
      <div className="flip-container">
        <div ref={cardRef} className="flip-card">
          {/* 🎓 HAT */}
          <img src="/hat.png" className="auth-hat" alt="hat" />

          {/* REGISTER */}
          <div className="auth-face auth-front">
            <h2>Register</h2>

            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />

            <button
              className="auth-btn"
              onClick={registerUser}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Create Account"}
            </button>

            <p className="auth-link" onClick={goLogin}>
              Already have an account? Login →
            </p>
          </div>

          {/* LOGIN */}
          <div className="auth-face auth-back">
            <h2>Login</h2>

            <input
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <button
              className="auth-btn"
              onClick={loginUser}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Login"}
            </button>

            <p className="auth-link" onClick={goRegister}>
              ← Back to Register
            </p>
          </div>
        </div>
      </div>

      {msg && <p className="auth-msg">{msg}</p>}
    </div>
  );
}
