import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import DetailPage from "./pages/DetailPage.js";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detail/:_id" element={<DetailPage />} />
      </Routes>
    </Router>
  );
}
