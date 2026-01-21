import { Routes, Route } from "react-router-dom";
import SakuraScene from "./SakuraScene";
import Home from "./Home";
import AuthBook from "./AuthBook";
import "./index.css";
import Dashboard from "./Dashboard";
import Hiragana from "./Hiragana";
import HiraganaQuiz from "./pages/HiraganaQuiz.jsx";

export default function App() {
  return (
    <>
      <SakuraScene />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthBook />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hiragana" element={<Hiragana />} />
        <Route path="/hiragana/quiz" element={<HiraganaQuiz />} />
      </Routes>
    </>
  );
}
