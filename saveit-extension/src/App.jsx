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
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/" element={<InitialPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/warning" element={<WarningPage />} />
      </Routes>
    </Router>
  );
}
