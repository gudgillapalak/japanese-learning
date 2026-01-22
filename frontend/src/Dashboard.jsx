import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

import dashboardBg from "../public/dashboard-bg.png";
import maleAvatar from "../public/avatar-male.png";
import femaleAvatar from "../public/avatar-female.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [data, setData] = useState(null);
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  const bgRef = useRef(null);
  const streakRef = useRef(null);
  const accuracyRef = useRef(null);
  const studyRef = useRef(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    if (!token) navigate("/login");
  }, [navigate, token]);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/users/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((j) => setData(j.data))
      .catch(() => navigate("/login"));
  }, [navigate, token]);

  /* ================= PARALLAX ================= */
  useEffect(() => {
    const move = (e) => {
      if (!bgRef.current) return;
      gsap.to(bgRef.current, {
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
        duration: 0.6,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* ================= ANIMATIONS ================= */
  useEffect(() => {
    if (!data) return;

    gsap.to(streakRef.current, {
      scale: 1.08,
      repeat: -1,
      yoyo: true,
      duration: 0.8,
    });

    gsap.fromTo(
      accuracyRef.current,
      { width: "0%" },
      { width: `${data.accuracy || 0}%`, duration: 1.4 }
    );

    gsap.fromTo(
      studyRef.current,
      { width: "0%" },
      {
        width: `${Math.min((data.study_time_minutes || 0) / 6, 100)}%`,
        duration: 1.4,
        delay: 0.2,
      }
    );
  }, [data]);

  if (!data) return null;

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const avatar = storedUser?.avatar === "male" ? maleAvatar : femaleAvatar;

  const toggleTheme = () => {
    const n = !dark;
    setDark(n);
    localStorage.setItem("theme", n ? "dark" : "light");
  };

  /* ================= BADGES ================= */
  const badges = [
    { icon: "🌸", label: "First Step", unlock: data.streak >= 1 },
    { icon: "🔥", label: "On Fire", unlock: data.streak >= 3 },
    { icon: "⭐", label: "Consistent", unlock: data.streak >= 7 },
    { icon: "🎯", label: "Accurate", unlock: data.accuracy >= 80 },
    { icon: "🏆", label: "Master", unlock: data.accuracy >= 95 && data.streak >= 14 },
  ];

  return (
    <div style={page}>
      <div
        ref={bgRef}
        style={{ ...bg, backgroundImage: `url(${dashboardBg})` }}
      />
      <div style={dark ? darkOverlay : lightOverlay} />

      {/* NAVBAR */}
      <nav style={dark ? darkNavbar : navbar}>
        <div style={{ fontWeight: 700 }}>🌸 SakuraLearn</div>
        <div style={navCenter}>
          <span onClick={() => navigate("/hiragana")}>Hiragana</span>
          <span onClick={() => navigate("/katakana")}>Katakana</span>
          <span onClick={() => navigate("/hiragana/quiz")}>Practice</span>
        </div>
        <button style={toggleBtn(dark)} onClick={toggleTheme}>
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </nav>

      {/* MAIN */}
      <div style={layout}>
        <div style={column}>
          {/* WELCOME */}
          <div style={dark ? darkCard : card}>
            <img src={avatar} alt="avatar" style={avatarStyle} />
            <div>
              <h2>Welcome back, {data.username} 🌸</h2>
              <div style={chips}>
                <span style={chip}>Beginner</span>
                <span ref={streakRef} style={streakChip}>
                  🔥 {data.streak} days
                </span>
              </div>
            </div>
          </div>

          {/* PROGRESS */}
          <div style={dark ? darkCard : card}>
            <h3>📊 Progress</h3>

            <p>Accuracy</p>
            <div style={barBg}>
              <div ref={accuracyRef} style={accuracyBar} />
            </div>

            <p style={{ marginTop: "1rem" }}>Study Time</p>
            <div style={barBg}>
              <div ref={studyRef} style={studyBar} />
            </div>
          </div>

          {/* ACTIONS */}
          <div style={actionGrid}>
            <button style={actionBtn} onClick={() => navigate("/hiragana/quiz")}>
              ▶ Continue Practice
            </button>
            <button style={actionBtn} onClick={() => navigate("/katakana")}>
              🈶 Learn Katakana
            </button>
            <button style={{ ...actionBtn, opacity: 0.7 }}>
              🧠 Weak Kana (Soon)
            </button>
          </div>

          {/* BADGES */}
          <div style={dark ? darkCard : card}>
            <h3>🏆 Badges</h3>
            <div style={badgeRow}>
              {badges.map((b, i) => (
                <div
                  key={i}
                  title={b.label}
                  style={{
                    ...badge,
                    opacity: b.unlock ? 1 : 0.25,
                    filter: b.unlock ? "none" : "grayscale(1)",
                  }}
                >
                  {b.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = { minHeight: "100vh", position: "relative", overflow: "hidden" };

const bg = {
  position: "absolute",
  inset: 0,
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: 0,
};

const lightOverlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(255,255,255,0.35)",
  zIndex: 1,
};

const darkOverlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(2,6,23,0.65)",
  zIndex: 1,
};

const navbar = {
  height: "64px",
  padding: "0 1.5rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "rgba(255,180,200,0.7)",
  backdropFilter: "blur(16px)",
  position: "relative",
  zIndex: 3,
};

const darkNavbar = {
  ...navbar,
  background: "rgba(15,23,42,0.9)",
  color: "#e5e7eb",
};

const navCenter = { display: "flex", gap: "1.4rem", cursor: "pointer" };

const toggleBtn = (dark) => ({
  padding: "0.4rem 1rem",
  borderRadius: "999px",
  border: dark ? "1px solid #fff" : "1px solid #000",
  background: dark ? "#020617" : "#fff",
  color: dark ? "#fff" : "#000",
  cursor: "pointer",
});

const layout = {
  position: "relative",
  zIndex: 2,
  padding: "2rem",
  display: "grid",
  gridTemplateColumns: "minmax(360px, 42%) 1fr",
};

const column = { display: "flex", flexDirection: "column", gap: "1.6rem" };

const card = {
  background: "rgba(255,255,255,0.8)",
  borderRadius: "24px",
  padding: "2rem",
  backdropFilter: "blur(18px)",
};

const darkCard = {
  ...card,
  background: "rgba(15,23,42,0.85)",
  color: "#e5e7eb",
};

const avatarStyle = {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
};

const chips = { display: "flex", gap: "0.6rem", marginTop: "0.6rem" };

const chip = {
  padding: "0.35rem 0.8rem",
  borderRadius: "14px",
  background: "rgba(255,180,200,0.8)",
};

const streakChip = {
  padding: "0.35rem 0.8rem",
  borderRadius: "14px",
  background: "linear-gradient(135deg,#ff9a3c,#ff5f3c)",
  color: "#fff",
};

const barBg = {
  height: "10px",
  background: "rgba(0,0,0,0.15)",
  borderRadius: "999px",
};

const accuracyBar = {
  height: "100%",
  background: "linear-gradient(90deg,#22c55e,#4ade80)",
  borderRadius: "999px",
};

const studyBar = {
  height: "100%",
  background: "linear-gradient(90deg,#ec4899,#f472b6)",
  borderRadius: "999px",
};

const actionGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
  gap: "1rem",
};

const actionBtn = {
  padding: "1rem",
  borderRadius: "16px",
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(135deg,#ec4899,#f472b6)",
  color: "#fff",
  fontWeight: 600,
};

const badgeRow = { display: "flex", gap: "0.7rem" };

const badge = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  background: "rgba(255,220,230,0.9)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
