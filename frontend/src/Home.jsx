import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function Home() {
  const title = useRef(null);
  const text = useRef(null);
  const btn = useRef(null);
  const features = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.set(
      [title.current, text.current, btn.current, ...features.current],
      { opacity: 0, y: 12 }
    );

    gsap
      .timeline({ delay: 0.3 })
      .to(title.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      })
      .to(
        text.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3"
      )
      .to(
        btn.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.3"
      )
      .to(
        features.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.2"
      );
  }, []);

  return (
    <div style={page}>
      {/* HERO */}
      <h1 ref={title} style={heading}>
        LEARN JAPANESE <br /> THE RIGHT WAY
      </h1>

      <p ref={text} style={subtext}>
        Master Hiragana, vocabulary, and grammar step by step.
      </p>

      {/* CTA */}
      <button
        ref={btn}
        style={button}
        onClick={() => navigate("/login")}
        onMouseEnter={(e) =>
          gsap.to(e.currentTarget, {
            boxShadow: "0 18px 40px rgba(246,177,195,0.4)",
            duration: 0.25,
          })
        }
        onMouseLeave={(e) =>
          gsap.to(e.currentTarget, {
            boxShadow: "0 12px 30px rgba(246,177,195,0.35)",
            duration: 0.25,
          })
        }
      >
        START LEARNING
      </button>

      {/* FEATURES */}
      <div style={featuresWrap}>
        {[
          {
            title: "Hiragana & Katakana",
            info: "Read & write Japanese characters confidently",
          },
          {
            title: "JLPT Grammar",
            info: "Clear grammar for all JLPT levels",
          },
          {
            title: "Daily Practice",
            info: "Short exercises for consistent progress",
          },
        ].map((item, i) => (
          <div
            key={i}
            ref={(el) => (features.current[i] = el)}
            style={featureItem}
            onMouseEnter={(e) =>
              gsap.to(e.currentTarget, {
                y: -4,
                boxShadow: "0 14px 30px rgba(246,177,195,0.28)",
                duration: 0.25,
              })
            }
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, {
                y: 0,
                boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                duration: 0.25,
              })
            }
          >
            <span style={featureTitle}>✓ {item.title}</span>
            <p style={featureInfo}>{item.info}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: "0 2rem",
  position: "relative",
  zIndex: 10,
};

const heading = {
  fontSize: "3.4rem",
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: "0.04em",
  marginBottom: "1.4rem",
};

const subtext = {
  fontSize: "1.1rem",
  lineHeight: 1.8,
  opacity: 0.7,
  marginBottom: "3rem",
};

const button = {
  padding: "1.05rem 2.6rem",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(135deg, #f6b1c3, #f39ab0)",
  fontSize: "1rem",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 12px 30px rgba(246,177,195,0.35)",
};

const featuresWrap = {
  display: "flex",
  gap: "2.8rem",
  marginTop: "2.8rem",
  flexWrap: "wrap",
  justifyContent: "center",
};

const featureItem = {
  padding: "1.2rem 1.9rem",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(10px)",
  cursor: "default",
  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
};

const featureTitle = {
  fontSize: "1rem",
  fontWeight: 600,
};

const featureInfo = {
  marginTop: "0.4rem",
  fontSize: "0.9rem",
  opacity: 0.65,
  color: "#555",
};
