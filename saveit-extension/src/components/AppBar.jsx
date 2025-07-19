import Close from "../assets/Close.svg";
import Logo from "../assets/saveItLogo.svg";

export default function AppBar() {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <img width="28px" height="28px" src={Logo} />
        <h2 className="text-2xl font-heading">
          Save<span className="font-bold">It</span>
        </h2>
      </div>
      <button
        onClick={() => window.close()}
        type="button"
        aria-label="Close"
        title="Close">
        <i>
          <img src={Close} alt="Close" />
        </i>
      </button>
    </div>
  );
}
