import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

import dashboardBg from "../public/dashboard-bg.png";
import maleAvatar from "../public/avatar-male.png";
import femaleAvatar from "../public/avatar-female.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [data, setData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const streakRef = useRef(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    if (!storedUser || !token) navigate("/login");
  }, [navigate, storedUser, token]);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }

        const json = await res.json();
        setData(json.data);
      } catch {
        navigate("/login");
      }
    };

    fetchDashboard();
  }, []);

  /* ================= STREAK ANIMATION ================= */
  useEffect(() => {
    if (!data || !streakRef.current) return;

    gsap.to(streakRef.current, {
      scale: 1.08,
      repeat: -1,
      yoyo: true,
      duration: 0.8,
    });
  }, [data]);

  if (!data) return null;

  const avatar =
    data.gender === "male" ? maleAvatar : femaleAvatar;

  const badges = [
    { icon: "🌸", unlock: data.streak >= 1 },
    { icon: "🔥", unlock: data.streak >= 3 },
    { icon: "⭐", unlock: data.streak >= 7 },
    { icon: "🔒", unlock: false },
  ];

  return (
    <div style={page}>
      <div style={overlay} />

      {/* NAVBAR */}
      <nav style={navbar}>
        <div style={navLeft}>🌸 SakuraLearn</div>

        <div className="nav-links" style={navCenter}>
          <span onClick={() => navigate("/hiragana")}>Hiragana</span>
          <span onClick={() => navigate("/katakana")}>Katakana</span>
          <span onClick={() => navigate("/hiragana/quiz")}>Practice</span>
        </div>

        <div
          className="hamburger"
          style={hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>
      </nav>

      {menuOpen && (
        <div style={mobileMenu}>
          <span onClick={() => navigate("/hiragana")}>Hiragana</span>
          <span onClick={() => navigate("/katakana")}>Katakana</span>
          <span onClick={() => navigate("/hiragana/quiz")}>Practice</span>
          <span
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </span>
        </div>
      )}

      {/* MAIN */}
      <div style={layout}>
        <div style={glassColumn}>
          {/* WELCOME */}
          <div className="welcome-card" style={welcomeCard}>
            <img src={avatar} alt="avatar" style={avatarStyle} />
            <div>
              <h1 style={welcomeTitle}>
                Welcome back, {data.username} 🌸
              </h1>
              <div style={welcomeMeta}>
                <span style={levelChip}>Beginner</span>
                <span ref={streakRef} style={streakChip}>
                  🔥 {data.streak} days
                </span>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="stats-grid" style={statsGrid}>
            {[
              ["Study Time", `${Math.floor(data.study_time_minutes / 60)} hrs`],
              ["Accuracy", `${data.accuracy}%`],
              ["Streak", `${data.streak} days`],
              ["Rank", `#${data.rank ?? 0}`],
            ].map(([title, value], i) => (
              <div key={i} className="stat-card" style={statCard}>
                <p style={statTitle}>{title}</p>
                <h3>{value}</h3>
              </div>
            ))}
          </div>

          {/* BADGES */}
          <div style={badgeCard}>
            <h3>Badges</h3>
            <div style={badgeRow}>
              {badges.map((b, i) => (
                <div
                  key={i}
                  style={{
                    ...badge,
                    opacity: b.unlock ? 1 : 0.35,
                    filter: b.unlock ? "none" : "grayscale(1)",
                  }}
                >
                  {b.icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div />
      </div>

      {/* MOBILE FIXES */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .hamburger {
            display: block !important;
          }

          .welcome-card {
            padding: 1.4rem !important;
            gap: 1rem !important;
          }

          .welcome-card img {
            width: 72px !important;
            height: 72px !important;
          }

          .stats-grid {
            grid-template-columns: 1fr !important;
          }

          .stat-card {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  backgroundImage: `url(${dashboardBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
};

const overlay = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.4))",
};

const navbar = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  height: "64px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 1.5rem",
  background: "rgba(255,180,200,0.65)",
  backdropFilter: "blur(16px)",
};

const navLeft = { fontWeight: 700 };
const navCenter = { display: "flex", gap: "1.5rem" };

const hamburger = {
  fontSize: "1.6rem",
  cursor: "pointer",
  display: "none",
};

const mobileMenu = {
  position: "absolute",
  top: "64px",
  right: "1rem",
  background: "rgba(255,255,255,0.95)",
  borderRadius: "14px",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
  zIndex: 20,
};

const layout = {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gridTemplateColumns: "minmax(360px, 42%) 1fr",
  padding: "2rem",
};

const glassColumn = {
  display: "flex",
  flexDirection: "column",
  gap: "1.6rem",
};

const welcomeCard = {
  display: "flex",
  gap: "1.8rem",
  padding: "3rem",
  borderRadius: "26px",
  background: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(18px)",
};

const avatarStyle = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
};

const welcomeTitle = {
  fontSize: "1.4rem",
  marginBottom: "0.6rem",
};

const welcomeMeta = {
  display: "flex",
  gap: "0.6rem",
  flexWrap: "wrap",
};

const levelChip = {
  padding: "0.4rem 0.9rem",
  borderRadius: "16px",
  background: "rgba(255,180,200,0.85)",
};

const streakChip = {
  padding: "0.4rem 0.9rem",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #ff9a3c, #ff5f3c)",
  color: "#fff",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "1rem",
};

const statCard = {
  padding: "1.4rem",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.75)",
  backdropFilter: "blur(14px)",
  textAlign: "center",
};

const statTitle = { opacity: 0.6 };

const badgeCard = {
  padding: "1.4rem",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.75)",
  backdropFilter: "blur(14px)",
};

const badgeRow = {
  display: "flex",
  gap: "0.7rem",
};

const badge = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "rgba(255,220,230,0.9)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
