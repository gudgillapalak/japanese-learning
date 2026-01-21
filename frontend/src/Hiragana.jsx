import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const HIRAGANA = [
  { char: "あ", romaji: "a" },
  { char: "い", romaji: "i" },
  { char: "う", romaji: "u" },
  { char: "え", romaji: "e" },
  { char: "お", romaji: "o" },

  { char: "か", romaji: "ka" },
  { char: "き", romaji: "ki" },
  { char: "く", romaji: "ku" },
  { char: "け", romaji: "ke" },
  { char: "こ", romaji: "ko" },

  { char: "さ", romaji: "sa" },
  { char: "し", romaji: "shi", audio: "chi.mp3" },
  { char: "す", romaji: "su" },
  { char: "せ", romaji: "se" },
  { char: "そ", romaji: "so" },

  { char: "た", romaji: "ta" },
  { char: "ち", romaji: "chi" },
  { char: "つ", romaji: "tsu" },
  { char: "て", romaji: "te" },
  { char: "と", romaji: "to" },

  { char: "な", romaji: "na" },
  { char: "に", romaji: "ni" },
  { char: "ぬ", romaji: "nu" },
  { char: "ね", romaji: "ne" },
  { char: "の", romaji: "no" },

  { char: "は", romaji: "ha" },
  { char: "ひ", romaji: "hi" },
  { char: "ふ", romaji: "fu" },
  { char: "へ", romaji: "he" },
  { char: "ほ", romaji: "ho" },

  { char: "ま", romaji: "ma" },
  { char: "み", romaji: "mi" },
  { char: "む", romaji: "mu" },
  { char: "め", romaji: "me" },
  { char: "も", romaji: "mo" },

  { char: "ん", romaji: "n" },
];

export default function Hiragana() {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [selected, setSelected] = useState(null);
  const [learned, setLearned] = useState(() => {
    const saved = localStorage.getItem("hiragana_learned");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const playSound = (item) => {
    const file = item.audio || `${item.romaji}.mp3`;
    audioRef.current.src = `/audio/hiragana/${file}`;
    audioRef.current.load();
    audioRef.current.play().catch(() => {});
  };

  const handleSelect = (item) => {
    setSelected(item);
    playSound(item);

    if (!learned.includes(item.char)) {
      const updated = [...learned, item.char];
      setLearned(updated);
      localStorage.setItem("hiragana_learned", JSON.stringify(updated));
    }
  };

  const total = HIRAGANA.length;
  const completed = learned.length;
  const percent = Math.round((completed / total) * 100);

  // 🔓 LOWERED FOR TESTING
  const quizUnlocked = percent >= 10;

  return (
    <div style={{ padding: "2rem" }}>
      <audio ref={audioRef} />

      <h2>Hiragana 🌸</h2>

      <p>
        Progress: {completed}/{total} ({percent}%)
      </p>

      <button
        disabled={!quizUnlocked}
        onClick={() => navigate("/hiragana/quiz")}
        style={{
          padding: "0.8rem 1.5rem",
          borderRadius: "16px",
          border: "none",
          background: quizUnlocked ? "#f39ab0" : "#ccc",
          color: "#fff",
          cursor: quizUnlocked ? "pointer" : "not-allowed",
          marginBottom: "1.5rem",
        }}
      >
        🧠 Practice Quiz
      </button>

      {selected && (
        <div onClick={() => playSound(selected)}>
          <h1>{selected.char}</h1>
          <p>{selected.romaji}</p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
          gap: "1rem",
        }}
      >
        {HIRAGANA.map((item, i) => (
          <div
            key={i}
            onClick={() => handleSelect(item)}
            style={{
              padding: "1rem",
              borderRadius: "12px",
              textAlign: "center",
              background: learned.includes(item.char)
                ? "#d7ffe6"
                : "#fff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "1.6rem" }}>{item.char}</div>
            <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>
              {item.romaji}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
