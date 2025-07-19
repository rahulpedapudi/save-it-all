import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          {user.picture && (
            <img
              src={user.picture}
              alt={user.name}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Account Information</h2>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>User ID:</strong> {user.user_id}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={logout} variant="destructive" className="w-full">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
