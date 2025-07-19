import AppBar from "../components/AppBar";
export default function SuccessPage() {
  return (
    <div className="w-[400px] border-2 m-auto p-[20px]">
      <AppBar />
      <div className="text-center mt-10">
        <h1 className="mb-4 font-black text-5xl font-heading">
          Got It! In your{" "}
          <span className="text-saveit-accent font-normal">
            Save<span className="font-bold">It </span>
          </span>
          Box
        </h1>
        <a
          className="font-body underline text-saveit-accent font-bold text-md"
          href="">
          View it in SaveIt Dashboard
        </a>
        <button
          id="primary-btn"
          onClick={() => window.close()}
          className="w-full h-12 mt-6 text-lg rounded-[5px] font-bold bg-saveit-dark text-saveit-light"
          type="button">
          Done
        </button>
      </div>
    </div>
  );
}
