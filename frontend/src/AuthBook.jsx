import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

import maleAvatar from "../public/avatar-male.png";
import femaleAvatar from "../public/avatar-female.png";

export default function AuthBook() {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);

  /* ================= REGISTER STATE ================= */
  const [username, setUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [avatar, setAvatar] = useState(""); // ✅ AVATAR PICK

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
    if (!username || !regEmail || !regPassword || !avatar) {
      setMsg("⚠️ Please fill all fields and choose an avatar");
      return;
    }

    setLoading(true);
    setMsg("⏳ Registering...");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email: regEmail,
          password: regPassword,
          avatar, // ✅ SAVE AVATAR TYPE
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

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

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
          <img src="/hat.png" className="auth-hat" alt="hat" />

          {/* ================= REGISTER ================= */}
          <div className="auth-face auth-front">
            <h2>Register</h2>

            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

            {/* ✅ AVATAR PICKER */}
            <div className="avatar-picker">
              <p className="avatar-label">Choose Avatar</p>

              <div className="avatar-row">
                <img
                  src={maleAvatar}
                  alt="Male avatar"
                  className={`avatar-option ${
                    avatar === "male" ? "selected" : ""
                  }`}
                  onClick={() => setAvatar("male")}
                />

                <img
                  src={femaleAvatar}
                  alt="Female avatar"
                  className={`avatar-option ${
                    avatar === "female" ? "selected" : ""
                  }`}
                  onClick={() => setAvatar("female")}
                />
              </div>
            </div>

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

          {/* ================= LOGIN ================= */}
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


