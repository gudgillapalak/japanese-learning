import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function Dashboard() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [data, setData] = useState(null);

  const welcomeRef = useRef(null);
  const statsRef = useRef([]);
  const actionsRef = useRef([]);
  const badgeRef = useRef(null);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!storedUser || !token) {
      navigate("/login");
    }
  }, [navigate, storedUser, token]);

  /* ================= FETCH DASHBOARD ================= */
  const fetchDashboard = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      const json = await res.json();
      setData(json.data);
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ================= STATS UPDATE APIs ================= */
  const addStudyTime = async (minutes) => {
    await fetch("http://localhost:5000/api/users/stats/study-time", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ minutes }),
    });
  };

  const updateStreak = async () => {
    await fetch("http://localhost:5000/api/users/stats/streak", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

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
          {
            title: "Study Time",
            value: `${Math.floor(data.study_time_minutes / 60)} hrs`,
          },
          { title: "Accuracy", value: `${data.accuracy}%` },
          { title: "Streak", value: `${data.streak} days` },
          { title: "Rank", value: `#${data.rank ?? "-"}` },
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
        {[
          { label: "Learn Hiragana", minutes: 15 },
          { label: "Learn Katakana", minutes: 15 },
          { label: "Practice", minutes: 30 },
        ].map((item, i) => (
          <div
            key={i}
            ref={(el) => (actionsRef.current[i] = el)}
            style={{
              ...actionCard,
              gridColumn: item.label === "Practice" ? "span 2" : "span 1",
              cursor: "pointer",
            }}
            onClick={() => navigate("/hiragana")}
          >
            {item.label}
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
  padding: "clamp(1.2rem, 4vw, 2.5rem)",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
  flexWrap: "wrap",
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
