import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= BASIC HIRAGANA ================= */
const BASIC = [
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

/* ================= DAKUTEN ================= */
const DAKUTEN = [
  { char: "が", romaji: "ga" },
  { char: "ぎ", romaji: "gi" },
  { char: "ぐ", romaji: "gu" },
  { char: "げ", romaji: "ge" },
  { char: "ご", romaji: "go" },

  { char: "ざ", romaji: "za" },
  { char: "じ", romaji: "ji" },
  { char: "ず", romaji: "zu" },
  { char: "ぜ", romaji: "ze" },
  { char: "ぞ", romaji: "zo" },

  { char: "だ", romaji: "da" },
  { char: "ぢ", romaji: "ji" },
  { char: "づ", romaji: "zu" },
  { char: "で", romaji: "de" },
  { char: "ど", romaji: "do" },

  { char: "ば", romaji: "ba" },
  { char: "び", romaji: "bi" },
  { char: "ぶ", romaji: "bu" },
  { char: "べ", romaji: "be" },
  { char: "ぼ", romaji: "bo" },
];

/* ================= HANDAKUTEN ================= */
const HANDAKUTEN = [
  { char: "ぱ", romaji: "pa" },
  { char: "ぴ", romaji: "pi" },
  { char: "ぷ", romaji: "pu" },
  { char: "ぺ", romaji: "pe" },
  { char: "ぽ", romaji: "po" },
];

const YOON = [
  { char: "きゃ", romaji: "kya" },
  { char: "きゅ", romaji: "kyu" },
  { char: "きょ", romaji: "kyo" },

  { char: "しゃ", romaji: "sha" },
  { char: "しゅ", romaji: "shu" },
  { char: "しょ", romaji: "sho" },

  { char: "ちゃ", romaji: "cha" },
  { char: "ちゅ", romaji: "chu" },
  { char: "ちょ", romaji: "cho" },

  { char: "にゃ", romaji: "nya" },
  { char: "にゅ", romaji: "nyu" },
  { char: "にょ", romaji: "nyo" },

  { char: "ひゃ", romaji: "hya" },
  { char: "ひゅ", romaji: "hyu" },
  { char: "ひょ", romaji: "hyo" },

  { char: "みゃ", romaji: "mya" },
  { char: "みゅ", romaji: "myu" },
  { char: "みょ", romaji: "myo" },

  { char: "りゃ", romaji: "rya" },
  { char: "りゅ", romaji: "ryu" },
  { char: "りょ", romaji: "ryo" },

  { char: "ぎゃ", romaji: "gya" },
  { char: "ぎゅ", romaji: "gyu" },
  { char: "ぎょ", romaji: "gyo" },

  { char: "じゃ", romaji: "ja" },
  { char: "じゅ", romaji: "ju" },
  { char: "じょ", romaji: "jo" },

  { char: "びゃ", romaji: "bya" },
  { char: "びゅ", romaji: "byu" },
  { char: "びょ", romaji: "byo" },

  { char: "ぴゃ", romaji: "pya" },
  { char: "ぴゅ", romaji: "pyu" },
  { char: "ぴょ", romaji: "pyo" }
];



export default function Hiragana() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const audioRef = useRef(null);
  const [selected, setSelected] = useState(null);

  /* 🌓 Dark mode state */
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (!token) navigate("/login");
  }, [navigate, token]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const playSound = (item) => {
    const file = item.audio || `${item.romaji}.mp3`;
    audioRef.current.src = `/audio/hiragana/${file}`;
    audioRef.current.load();
    audioRef.current.play().catch(() => {});
  };

  const Card = ({ item }) => (
    <div
      style={dark ? darkCard : card}
      onClick={() => {
        setSelected(item);
        playSound(item);
      }}
    >
      <span style={dark ? darkChar : char}>{item.char}</span>
      <span style={dark ? darkRomaji : romaji}>{item.romaji}</span>
    </div>
  );

  return (
    <div style={dark ? darkPage : page}>
      <audio ref={audioRef} />

      {/* Theme Toggle */}
      <div style={toggleWrap}>
        <button style={toggleBtn(dark)} onClick={toggleTheme}>
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <h2 style={dark ? darkTitle : title}>Hiragana 🌸</h2>

      {selected && (
        <div
          style={dark ? darkPreview : preview}
          onClick={() => playSound(selected)}
        >
          <h1>{selected.char}</h1>
          <p>{selected.romaji} · tap to hear 🔊</p>
        </div>
      )}

      <h3 style={section}>Basic Hiragana</h3>
      <div style={grid}>{BASIC.map((i, idx) => <Card key={idx} item={i} />)}</div>

      <h3 style={section}>Dakuten (が ざ だ ば)</h3>
      <div style={grid}>{DAKUTEN.map((i, idx) => <Card key={idx} item={i} />)}</div>

      <h3 style={section}>Handakuten (ぱ)</h3>
      <div style={grid}>{HANDAKUTEN.map((i, idx) => <Card key={idx} item={i} />)}</div>

       <h3 style={section}>Yoon (ようおん)</h3>
      <div style={grid}>{YOON.map((i, idx) => <Card key={idx} item={i} />)}</div>
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

const title = {
  fontSize: "2rem",
  marginBottom: "1rem",
};

const darkTitle = {
  fontSize: "2rem",
  marginBottom: "1rem",
  textShadow: "0 4px 18px rgba(255,183,197,0.4)",
};

const section = {
  margin: "2rem 0 1rem",
  fontWeight: 600,
};

const preview = {
  background: "#fff",
  padding: "1.5rem",
  borderRadius: "16px",
  textAlign: "center",
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
};

const darkPreview = {
  background: "rgba(15,23,42,0.85)",
  padding: "1.5rem",
  borderRadius: "16px",
  textAlign: "center",
  cursor: "pointer",
  boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
  gap: "1rem",
};

const card = {
  background: "#fff",
  padding: "1.2rem",
  borderRadius: "14px",
  textAlign: "center",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const darkCard = {
  background: "rgba(15,23,42,0.9)",
  padding: "1.2rem",
  borderRadius: "14px",
  textAlign: "center",
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const char = {
  fontSize: "1.8rem",
  display: "block",
};

const darkChar = {
  fontSize: "1.8rem",
  display: "block",
  color: "#f8fafc",
};

const romaji = {
  fontSize: "0.75rem",
  opacity: 0.6,
};

const darkRomaji = {
  fontSize: "0.75rem",
  opacity: 0.7,
};

const toggleWrap = {
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
