import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= BASIC KATAKANA ================= */
const BASIC = [
  { char: "ア", romaji: "a" },
  { char: "イ", romaji: "i" },
  { char: "ウ", romaji: "u" },
  { char: "エ", romaji: "e" },
  { char: "オ", romaji: "o" },

  { char: "カ", romaji: "ka" },
  { char: "キ", romaji: "ki" },
  { char: "ク", romaji: "ku" },
  { char: "ケ", romaji: "ke" },
  { char: "コ", romaji: "ko" },

  { char: "サ", romaji: "sa" },
  { char: "シ", romaji: "shi" },
  { char: "ス", romaji: "su" },
  { char: "セ", romaji: "se" },
  { char: "ソ", romaji: "so" },

  { char: "タ", romaji: "ta" },
  { char: "チ", romaji: "chi" },
  { char: "ツ", romaji: "tsu" },
  { char: "テ", romaji: "te" },
  { char: "ト", romaji: "to" },

  { char: "ナ", romaji: "na" },
  { char: "ニ", romaji: "ni" },
  { char: "ヌ", romaji: "nu" },
  { char: "ネ", romaji: "ne" },
  { char: "ノ", romaji: "no" },

  { char: "ハ", romaji: "ha" },
  { char: "ヒ", romaji: "hi" },
  { char: "フ", romaji: "fu" },
  { char: "ヘ", romaji: "he" },
  { char: "ホ", romaji: "ho" },

  { char: "マ", romaji: "ma" },
  { char: "ミ", romaji: "mi" },
  { char: "ム", romaji: "mu" },
  { char: "メ", romaji: "me" },
  { char: "モ", romaji: "mo" },

  { char: "ヤ", romaji: "ya" },
  { char: "ユ", romaji: "yu" },
  { char: "ヨ", romaji: "yo" },

  { char: "ラ", romaji: "ra" },
  { char: "リ", romaji: "ri" },
  { char: "ル", romaji: "ru" },
  { char: "レ", romaji: "re" },
  { char: "ロ", romaji: "ro" },

  { char: "ワ", romaji: "wa" },
  { char: "ヲ", romaji: "wo" },
  { char: "ン", romaji: "n" },
];

/* ================= DAKUTEN ================= */
const DAKUTEN = [
  { char: "ガ", romaji: "ga" },
  { char: "ギ", romaji: "gi" },
  { char: "グ", romaji: "gu" },
  { char: "ゲ", romaji: "ge" },
  { char: "ゴ", romaji: "go" },

  { char: "ザ", romaji: "za" },
  { char: "ジ", romaji: "ji" },
  { char: "ズ", romaji: "zu" },
  { char: "ゼ", romaji: "ze" },
  { char: "ゾ", romaji: "zo" },

  { char: "ダ", romaji: "da" },
  { char: "ヂ", romaji: "ji" },
  { char: "ヅ", romaji: "zu" },
  { char: "デ", romaji: "de" },
  { char: "ド", romaji: "do" },

  { char: "バ", romaji: "ba" },
  { char: "ビ", romaji: "bi" },
  { char: "ブ", romaji: "bu" },
  { char: "ベ", romaji: "be" },
  { char: "ボ", romaji: "bo" },
];

/* ================= HANDAKUTEN ================= */
const HANDAKUTEN = [
  { char: "パ", romaji: "pa" },
  { char: "ピ", romaji: "pi" },
  { char: "プ", romaji: "pu" },
  { char: "ペ", romaji: "pe" },
  { char: "ポ", romaji: "po" },
];

const YOON = [
  { char: "キャ", romaji: "kya" },
  { char: "キュ", romaji: "kyu" },
  { char: "キョ", romaji: "kyo" },

  { char: "シャ", romaji: "sha" },
  { char: "シュ", romaji: "shu" },
  { char: "ショ", romaji: "sho" },

  { char: "チャ", romaji: "cha" },
  { char: "チュ", romaji: "chu" },
  { char: "チョ", romaji: "cho" },

  { char: "ニャ", romaji: "nya" },
  { char: "ニュ", romaji: "nyu" },
  { char: "ニョ", romaji: "nyo" },

  { char: "ヒャ", romaji: "hya" },
  { char: "ヒュ", romaji: "hyu" },
  { char: "ヒョ", romaji: "hyo" },

  { char: "ミャ", romaji: "mya" },
  { char: "ミュ", romaji: "myu" },
  { char: "ミョ", romaji: "myo" },

  { char: "リャ", romaji: "rya" },
  { char: "リュ", romaji: "ryu" },
  { char: "リョ", romaji: "ryo" },

  { char: "ギャ", romaji: "gya" },
  { char: "ギュ", romaji: "gyu" },
  { char: "ギョ", romaji: "gyo" },

  { char: "ジャ", romaji: "ja" },
  { char: "ジュ", romaji: "ju" },
  { char: "ジョ", romaji: "jo" },

  { char: "ビャ", romaji: "bya" },
  { char: "ビュ", romaji: "byu" },
  { char: "ビョ", romaji: "byo" },

  { char: "ピャ", romaji: "pya" },
  { char: "ピュ", romaji: "pyu" },
  { char: "ピョ", romaji: "pyo" }
];


export default function Katakana() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const audioRef = useRef(null);
  const [selected, setSelected] = useState(null);

  /* 🌓 Dark mode */
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
    const file = `${item.romaji}.mp3`;
    audioRef.current.src = `/audio/katakana/${file}`;
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

      <h2 style={dark ? darkTitle : title}>Katakana 🌸</h2>

      {selected && (
        <div
          style={dark ? darkPreview : preview}
          onClick={() => playSound(selected)}
        >
          <h1>{selected.char}</h1>
          <p>{selected.romaji} · tap to hear 🔊</p>
        </div>
      )}

      <h3 style={section}>Basic Katakana</h3>
      <div style={grid}>{BASIC.map((i, idx) => <Card key={idx} item={i} />)}</div>

      <h3 style={section}>Dakuten (ガ ザ ダ バ)</h3>
      <div style={grid}>{DAKUTEN.map((i, idx) => <Card key={idx} item={i} />)}</div>

      <h3 style={section}>Handakuten (パ)</h3>
      <div style={grid}>{HANDAKUTEN.map((i, idx) => <Card key={idx} item={i} />)}</div>

      <h3 style={section}>Yoon (拗音)</h3>
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
