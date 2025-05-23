import AppBar from "../components/AppBar";
export default function WarningPage() {
  const warningMessages = [
    "Heads up! You've already saved this exact link.",
    "Already Saved! This link is already in your SaveIt Box.",
  ];

  const randomIndex = Math.floor(Math.random() * warningMessages.length);
  const warningMessage = warningMessages[randomIndex];

  return (
    <div className="w-[400px] border-2 m-auto p-[20px]">
      <AppBar />
      <div className="text-center mt-5">
        <h1 className="mb-2 font-black text-4xl font-heading text-saveit-danger">
          {warningMessage}
        </h1>
        <button
          id="primary-btn"
          className="mt-4 w-full h-12 text-lg rounded-[5px] font-bold bg-saveit-dark text-saveit-light"
          type="button">
          View Existing Item
        </button>
      </div>
    </div>
  );
}
