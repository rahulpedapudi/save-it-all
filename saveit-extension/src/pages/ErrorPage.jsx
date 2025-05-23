import { useNavigate } from "react-router-dom";
import AppBar from "../components/AppBar";
export default function ErrorPage() {
  const navigate = useNavigate();
  const errorMessages = [
    "Connection error. SaveIt couldn't reach the page.",
    "Oops! Couldn't save this page right now. Please try again later.",
  ];

  const randomIndex = Math.floor(Math.random() * errorMessages.length);
  const errorMessage = errorMessages[randomIndex];

  const handleRetry = () => {
    navigate("/");
  };

  return (
    <div className="w-[400px] border-2 m-auto p-[20px]">
      <AppBar />
      <div className="text-center mt-5">
        <h1 className="mb-2 font-black text-4xl font-heading text-saveit-danger">
          {errorMessage}
        </h1>
        <button
          id="primary-btn"
          onClick={handleRetry}
          className="mt-4 w-full h-12 text-lg rounded-[5px] font-bold bg-saveit-dark text-saveit-light"
          type="button">
          Retry
        </button>
      </div>
    </div>
  );
}
