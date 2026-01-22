import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= FULL HIRAGANA ================= */
const HIRAGANA = [
  { char: "あ", romaji: "a" }, { char: "い", romaji: "i" },
  { char: "う", romaji: "u" }, { char: "え", romaji: "e" },
  { char: "お", romaji: "o" },

  { char: "か", romaji: "ka" }, { char: "き", romaji: "ki" },
  { char: "く", romaji: "ku" }, { char: "け", romaji: "ke" },
  { char: "こ", romaji: "ko" },

  { char: "さ", romaji: "sa" }, { char: "し", romaji: "shi" },
  { char: "す", romaji: "su" }, { char: "せ", romaji: "se" },
  { char: "そ", romaji: "so" },

  { char: "た", romaji: "ta" }, { char: "ち", romaji: "chi" },
  { char: "つ", romaji: "tsu" }, { char: "て", romaji: "te" },
  { char: "と", romaji: "to" },

  { char: "な", romaji: "na" }, { char: "に", romaji: "ni" },
  { char: "ぬ", romaji: "nu" }, { char: "ね", romaji: "ne" },
  { char: "の", romaji: "no" },

  { char: "は", romaji: "ha" }, { char: "ひ", romaji: "hi" },
  { char: "ふ", romaji: "fu" }, { char: "へ", romaji: "he" },
  { char: "ほ", romaji: "ho" },

  { char: "ま", romaji: "ma" }, { char: "み", romaji: "mi" },
  { char: "む", romaji: "mu" }, { char: "め", romaji: "me" },
  { char: "も", romaji: "mo" },

  { char: "や", romaji: "ya" }, { char: "ゆ", romaji: "yu" },
  { char: "よ", romaji: "yo" },

  { char: "ら", romaji: "ra" }, { char: "り", romaji: "ri" },
  { char: "る", romaji: "ru" }, { char: "れ", romaji: "re" },
  { char: "ろ", romaji: "ro" },

  { char: "わ", romaji: "wa" },
  { char: "を", romaji: "wo" },
  { char: "ん", romaji: "n" },
];

/* ================= FULL KATAKANA ================= */
const KATAKANA = [
  { char: "ア", romaji: "a" }, { char: "イ", romaji: "i" },
  { char: "ウ", romaji: "u" }, { char: "エ", romaji: "e" },
  { char: "オ", romaji: "o" },

  { char: "カ", romaji: "ka" }, { char: "キ", romaji: "ki" },
  { char: "ク", romaji: "ku" }, { char: "ケ", romaji: "ke" },
  { char: "コ", romaji: "ko" },

  { char: "サ", romaji: "sa" }, { char: "シ", romaji: "shi" },
  { char: "ス", romaji: "su" }, { char: "セ", romaji: "se" },
  { char: "ソ", romaji: "so" },

  { char: "タ", romaji: "ta" }, { char: "チ", romaji: "chi" },
  { char: "ツ", romaji: "tsu" }, { char: "テ", romaji: "te" },
  { char: "ト", romaji: "to" },

  { char: "ナ", romaji: "na" }, { char: "ニ", romaji: "ni" },
  { char: "ヌ", romaji: "nu" }, { char: "ネ", romaji: "ne" },
  { char: "ノ", romaji: "no" },

  { char: "ハ", romaji: "ha" }, { char: "ヒ", romaji: "hi" },
  { char: "フ", romaji: "fu" }, { char: "ヘ", romaji: "he" },
  { char: "ホ", romaji: "ho" },

  { char: "マ", romaji: "ma" }, { char: "ミ", romaji: "mi" },
  { char: "ム", romaji: "mu" }, { char: "メ", romaji: "me" },
  { char: "モ", romaji: "mo" },

  { char: "ヤ", romaji: "ya" }, { char: "ユ", romaji: "yu" },
  { char: "ヨ", romaji: "yo" },

  { char: "ラ", romaji: "ra" }, { char: "リ", romaji: "ri" },
  { char: "ル", romaji: "ru" }, { char: "レ", romaji: "re" },
  { char: "ロ", romaji: "ro" },

  { char: "ワ", romaji: "wa" },
  { char: "ヲ", romaji: "wo" },
  { char: "ン", romaji: "n" },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

/* ================= COMPONENT ================= */

export default function KanaQuiz() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("hiragana"); // hiragana | katakana | mixed
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [progressData, setProgressData] = useState(
    JSON.parse(localStorage.getItem("kanaProgress")) || {}
  );

  const TOTAL_QUESTIONS = 10;

  /* ================= INIT QUIZ ================= */

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    let source = HIRAGANA;
    if (mode === "katakana") source = KATAKANA;
    if (mode === "mixed") source = [...HIRAGANA, ...KATAKANA];

    const shuffled = shuffle(source).slice(0, TOTAL_QUESTIONS);

    const quiz = shuffled.map((item) => {
      const wrong = shuffle(
        source.filter((k) => k.romaji !== item.romaji)
      )
        .slice(0, 3)
        .map((k) => k.romaji);

      return {
        char: item.char,
        correct: item.romaji,
        options: shuffle([item.romaji, ...wrong]),
      };
    });

    setQuestions(quiz);
    setCurrent(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
  }, [mode, navigate]);

  /* ================= HANDLERS ================= */

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);

    const q = questions[current];
    const key = q.char;

    const updated = { ...progressData };
    if (!updated[key]) updated[key] = { correct: 0, attempts: 0 };
    updated[key].attempts += 1;

    if (opt === q.correct) {
      updated[key].correct += 1;
      setScore((s) => s + 1);
    }

    setProgressData(updated);
    localStorage.setItem("kanaProgress", JSON.stringify(updated));

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 700);
  };

  if (!questions.length) return null;

  const total = questions.length;
  const accuracy = Math.round((score / total) * 100);
  const progress = Math.round((current / total) * 100);

  /* ================= UI ================= */

  return (
    <div style={dark ? darkPage : page}>
      <div style={topRight}>
        <button style={toggleBtn(dark)} onClick={toggleTheme}>
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div style={container}>
        <h2 style={title}>Kana Quiz 🌸</h2>

        <div style={modeWrap}>
          {["hiragana", "katakana", "mixed"].map((m) => (
            <button
              key={m}
              style={modeBtn(mode === m)}
              onClick={() => setMode(m)}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={progressWrap}>
          <div style={{ ...progressBar, width: `${progress}%` }} />
        </div>

        {!finished ? (
          <>
            <p>Question {current + 1} / {total}</p>

            <div style={questionCard}>
              <span style={kana}>{questions[current].char}</span>
            </div>

            <div style={options}>
              {questions[current].options.map((opt, i) => {
                let bg = dark ? "rgba(255,255,255,0.9)" : "#fff";
                if (selected) {
                  if (opt === questions[current].correct) bg = "#4ade80";
                  else if (opt === selected) bg = "#f87171";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    style={{ ...optionBtn, background: bg }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <h3>Quiz Completed 🎉</h3>
            <p>Score: {score}/{total}</p>
            <p>Accuracy: {accuracy}%</p>

            <h4 style={{ marginTop: "2rem" }}>📊 Kana Progress</h4>
            <div style={progressGrid}>
              {Object.entries(progressData).map(([k, v]) => (
                <div key={k} style={progressCard}>
                  <strong>{k}</strong>
                  <div>{v.correct}/{v.attempts}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  padding: "2rem",
  background: "linear-gradient(#fff6f9, #ffffff)",
};

const darkPage = {
  minHeight: "100vh",
  padding: "2rem",
  background: "linear-gradient(180deg, #0f172a, #020617)",
  color: "#e5e7eb",
};

const container = {
  maxWidth: "900px",
  margin: "0 auto",
  textAlign: "center",
};

const title = {
  fontWeight: "600",
  textShadow: "0 4px 18px rgba(255,183,197,0.4)",
};

const modeWrap = {
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
  marginBottom: "1.5rem",
};

const modeBtn = (active) => ({
  padding: "0.5rem 1rem",
  borderRadius: "999px",
  border: "none",
  cursor: "pointer",
  background: active ? "#f472b6" : "#e5e7eb",
  color: active ? "#fff" : "#111",
});

const progressWrap = {
  width: "100%",
  height: "10px",
  background: "#020617",
  borderRadius: "10px",
  marginBottom: "1.5rem",
};

const progressBar = {
  height: "100%",
  background: "linear-gradient(90deg, #4ade80, #22c55e)",
};

const questionCard = {
  background: "rgba(15,23,42,0.85)",
  padding: "2.5rem",
  borderRadius: "22px",
  marginBottom: "1.8rem",
};

const kana = {
  fontSize: "4rem",
  fontWeight: "600",
  color: "#f8fafc",
};

const options = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "1.2rem",
};

const optionBtn = {
  padding: "1.1rem",
  borderRadius: "16px",
  border: "none",
  cursor: "pointer",
};

const progressGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
  gap: "1rem",
};

const progressCard = {
  padding: "0.8rem",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.1)",
};

const topRight = {
  position: "absolute",
  top: "1.5rem",
  right: "1.5rem",
};

const toggleBtn = (dark) => ({
  padding: "0.5rem 1rem",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: dark ? "#020617" : "#fff",
  color: dark ? "#fff" : "#111",
  cursor: "pointer",
});
