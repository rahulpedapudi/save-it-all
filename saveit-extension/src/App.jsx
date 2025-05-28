import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import InitialPage from "./pages/InitialPage";
import SuccessPage from "./pages/Success";
import ErrorPage from "./pages/ErrorPage";
import WarningPage from "./pages/Warning";

export default function App() {
  const onSave = async (dataToSave) => {
    const res = await fetch("http://localhost:5000/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSave),
    });

    return res;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialPage onSave={onSave} />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/warning" element={<WarningPage />} />
      </Routes>
    </Router>
  );
}
