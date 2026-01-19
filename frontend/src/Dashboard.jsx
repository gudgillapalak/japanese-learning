import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function Dashboard() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [data, setData] = useState(null);

  const welcomeRef = useRef(null);
  const statsRef = useRef([]);
  const actionsRef = useRef([]);
  const badgeRef = useRef(null);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!storedUser) navigate("/login");
  }, [navigate, storedUser]);

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    if (!storedUser) return;

    fetch(`http://localhost:5000/api/users/${storedUser.id}/dashboard`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => navigate("/login"));
  }, [storedUser, navigate]);

  /* ================= ANIMATION ================= */
  useEffect(() => {
    if (!data) return;

    gsap.set(
      [
        welcomeRef.current,
        badgeRef.current,
        ...statsRef.current,
        ...actionsRef.current,
      ],
      { opacity: 0, y: 10 }
    );

    gsap
      .timeline({ delay: 0.2 })
      .to(welcomeRef.current, { opacity: 1, y: 0, duration: 0.5 })
      .to(statsRef.current, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.4,
      })
      .to(actionsRef.current, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.4,
      })
      .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.4 });
  }, [data]);

  if (!data) return null;

  return (
    <div style={page}>
      {/* WELCOME */}
      <div ref={welcomeRef} style={welcomeCard}>
        <h2>Welcome back 🌸</h2>
        <p>{data.username}</p>
      </div>

      {/* STATS */}
      <div style={statsGrid}>
        {[
          { title: "Study Time", value: `${Math.floor(data.study_time_minutes / 60)} hrs` },
          { title: "Accuracy", value: `${data.accuracy}%` },
          { title: "Streak", value: `${data.streak} days` },
          { title: "Rank", value: `#${data.rank}` },
        ].map((item, i) => (
          <div
            key={i}
            ref={(el) => (statsRef.current[i] = el)}
            style={statCard}
          >
            <p style={statTitle}>{item.title}</p>
            <h3>{item.value}</h3>
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      <div style={actions}>
        {["Learn Hiragana", "Learn Katakana", "Practice"].map((text, i) => (
          <div
            key={i}
            ref={(el) => (actionsRef.current[i] = el)}
            style={{
              ...actionCard,
              gridColumn: text === "Practice" ? "span 2" : "span 1",
            }}
          >
            {text}
          </div>
        ))}
      </div>

      {/* BADGES */}
      <div ref={badgeRef} style={badgeCard}>
        <h3>Badges</h3>
        <div style={badgeRow}>
          {["🌸", "🔥", "⭐", "🔒"].map((b, i) => (
            <div key={i} style={badge}>
              {b}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  padding: "2.5rem",
  background: "linear-gradient(#fff6f9, #ffffff)",
};

const welcomeCard = {
  background: "#fff",
  padding: "1.6rem",
  borderRadius: "18px",
  marginBottom: "2rem",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "1.2rem",
  marginBottom: "2.5rem",
};

const statCard = {
  background: "#fff",
  padding: "1.2rem",
  borderRadius: "16px",
  textAlign: "center",
  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
};

const statTitle = {
  opacity: 0.6,
  marginBottom: "0.3rem",
};

const actions = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "1.4rem",
  marginBottom: "2.5rem",
};

const actionCard = {
  padding: "2rem",
  borderRadius: "18px",
  background: "linear-gradient(135deg, #f6b1c3, #f39ab0)",
  color: "#fff",
  fontWeight: 600,
  textAlign: "center",
};

const badgeCard = {
  background: "#fff",
  padding: "1.5rem",
  borderRadius: "18px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
};

const badgeRow = {
  display: "flex",
  gap: "0.8rem",
  marginTop: "1rem",
};

const badge = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "#ffe4ec",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.2rem",
};
