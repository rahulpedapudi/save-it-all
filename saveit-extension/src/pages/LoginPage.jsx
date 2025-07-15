import AppBar from "../components/AppBar";
export default function LoginPage() {
  const handleLogin = async () => {
    try {
      // Get the auth URL from backend
      const response = await fetch(
        "http://localhost:5000/api/auth/google/login"
      );
      const data = await response.json();

      if (data.auth_url) {
        // Open Google OAuth in a new tab
        window.open(data.auth_url, "_blank");
      } else {
        console.error("Failed to get auth URL");
      }
    } catch (error) {
      console.error("Error initiating login:", error);
    }
  };

  return (
    <div className="w-[400px] border-2 m-auto p-[20px]">
      <AppBar />
      <div className="text-center mt-5">
        <h1 className="mb-2 font-black text-4xl font-heading text-saveit-accent">
          Please Login to your Account
        </h1>
        <button
          id="primary-btn"
          className="mt-4 w-full h-12 text-lg rounded-[5px] font-bold bg-saveit-dark text-saveit-light"
          type="button"
          onClick={handleLogin}>
          Sign In with Google
        </button>
      </div>
    </div>
  );
}
