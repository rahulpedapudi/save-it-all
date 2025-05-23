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
  const handleSave = async (dataToSave, navigate) => {
    try {
      const res = await fetch("http://localhost:5000/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      if (res.ok) {
        navigate("/success");
      } else if (res.status == 409) {
        navigate("/warning");
      }
    } catch (error) {
      navigate("/error");
      console.error("Failed to Save: ", error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialPage onSave={handleSave} />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/warning" element={<WarningPage />} />
      </Routes>
    </Router>
  );
}
