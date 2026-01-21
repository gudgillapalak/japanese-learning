import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= FULL HIRAGANA SET ================= */
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
  { char: "し", romaji: "shi" },
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

  { char: "や", romaji: "ya" },
  { char: "ゆ", romaji: "yu" },
  { char: "よ", romaji: "yo" },

  { char: "ら", romaji: "ra" },
  { char: "り", romaji: "ri" },
  { char: "る", romaji: "ru" },
  { char: "れ", romaji: "re" },
  { char: "ろ", romaji: "ro" },

  { char: "わ", romaji: "wa" },
  { char: "を", romaji: "wo" },
  { char: "ん", romaji: "n" },
];

/* ================= UTILS ================= */
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export default function HiraganaQuiz() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const TOTAL_QUESTIONS = 10;

  /* ================= INIT QUIZ ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    const shuffled = shuffle(HIRAGANA).slice(0, TOTAL_QUESTIONS);

    const quiz = shuffled.map((item) => {
      const wrong = shuffle(
        HIRAGANA.filter((h) => h.romaji !== item.romaji)
      )
        .slice(0, 3)
        .map((h) => h.romaji);

      return {
        char: item.char,
        correct: item.romaji,
        options: shuffle([item.romaji, ...wrong]),
      };
    });

    setQuestions(quiz);
  }, [navigate]);

  if (!questions.length) return null;

  const total = questions.length;
  const progress = Math.round((current / total) * 100);
  const accuracy = Math.round((score / total) * 100);

  /* ================= HANDLE ANSWER ================= */
  const handleAnswer = (opt) => {
    if (selected) return;

    setSelected(opt);
    if (opt === questions[current].correct) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      if (current + 1 < total) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 700);
  };

  /* ================= RETRY ================= */
  const retry = () => {
    navigate(0);
  };

  /* ================= FINISHED ================= */
  if (finished) {
    return (
      <div style={page}>
        <h2>Quiz Completed 🎉</h2>
        <p>Score: {score}/{total}</p>
        <p>Accuracy: {accuracy}%</p>

        <button style={btn} onClick={retry}>
          Retry Quiz
        </button>

        <button
          style={{ ...btn, background: "#999" }}
          onClick={() => navigate("/hiragana")}
        >
          Back to Hiragana
        </button>
      </div>
    );
  }

  /* ================= QUIZ UI ================= */
  return (
    <div style={page}>
      <h2>Hiragana Quiz 🌸</h2>

      <div style={progressWrap}>
        <div style={{ ...progressBar, width: `${progress}%` }} />
      </div>

      <p>Question {current + 1} / {total}</p>

      <div style={questionCard}>
        <span style={{ fontSize: "3rem" }}>
          {questions[current].char}
        </span>
      </div>

      <div style={options}>
        {questions[current].options.map((opt, i) => {
          let bg = "#fff";
          if (selected) {
            if (opt === questions[current].correct) bg = "#b6f5c3";
            else if (opt === selected) bg = "#f5b6b6";
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
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  padding: "2rem",
  background: "linear-gradient(#fff6f9, #ffffff)",
  textAlign: "center",
};

const progressWrap = {
  width: "100%",
  height: "10px",
  background: "#eee",
  borderRadius: "10px",
  marginBottom: "1.5rem",
};

const progressBar = {
  height: "100%",
  background: "#4ade80",
  transition: "width 0.3s",
};

const questionCard = {
  background: "#fff",
  padding: "2rem",
  borderRadius: "18px",
  marginBottom: "1.5rem",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
};

const options = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "1rem",
};

const optionBtn = {
  padding: "1rem",
  borderRadius: "14px",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
};

const btn = {
  marginTop: "1.5rem",
  padding: "0.8rem 1.6rem",
  borderRadius: "16px",
  border: "none",
  background: "#f39ab0",
  color: "#fff",
  cursor: "pointer",
};
