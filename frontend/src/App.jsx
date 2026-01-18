import { Routes, Route } from "react-router-dom";
import SakuraScene from "./SakuraScene";
import Home from "./Home";
import AuthBook from "./AuthBook";
import "./index.css";
import Dashboard from "./Dashboard";

export default function App() {
  return (
    <>
      <SakuraScene />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthBook />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}
