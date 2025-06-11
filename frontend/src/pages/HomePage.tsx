import React, { useState, useEffect } from "react";
import Card from "../components/Card.js";
import { useAuth, useUser, SignOutButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button.js";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar.js";
import LoadingSpinner from "@/components/LoadingSpinner.js";

export default function HomePage() {
  // state for storing data
  const [data, setData] = useState([]);
  const [error, setError] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  // this is managed SearchBar component
  const [tagSearch, setTagSearch] = useState<string[]>([]);

  // provides access to the current user's authentication state and methods to manage the active session.
  const { getToken } = useAuth();

  // this hook sends the jwt to the extention. content.js --> background.js --> local storage
  useEffect(() => {
    const sendJWTToExtension = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.warn("No token found");
          return;
        }
        window.postMessage({ type: "FROM_PAGE", token }, "*");
      } catch (error) {
        console.error("Error getting clerk token", error);
      }
    };
    sendJWTToExtension();
  }, [getToken]);

  // for page navigation
  const navigate = useNavigate();

  // provides access to the current user's User object
  const { user } = useUser();

  // calling the endpoint which fetches all links
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const response = await fetch("http://localhost:5000/api/links", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const results = await response.json();

        if (response.ok) {
          setData(results.links);
        } else {
          setError(results.message || "Error fetching links");
        }
      } catch (error) {
        setError("Something went wrong. Try again after sometime.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ? this must be a protected route?
  // handling delete
  const handleDelete = async (_id: string) => {
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:5000/api/links/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // updating the UI by filtering out the item that has been deleted currently.
      if (res.ok) {
        setData((prev: any) => prev.filter((item: any) => item._id !== _id));
      } else {
        console.error("Delete Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex mt-6 mr-6 gap-5 justify-end place-items-center">
        <SearchBar
          setError={setError}
          setSearchData={setData}
          tags={tagSearch}
          setTag={setTagSearch}
        />
        <SignOutButton>
          <Button
            onClick={() => {
              window.postMessage({ type: "SIGN_OUT" }, "*");
            }}>
            Sign out
          </Button>
        </SignOutButton>

        <Button
          onClick={() => {
            navigate("/profile");
          }}>
          View Profile
        </Button>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-bold">Hello {user?.fullName} </h1>
      </div>
      <div className="p-10 flex gap-0.5 justify-evenly items-center flex-wrap">
        {error && <div className="text-gray-500 text-center mt-4">{error}</div>}
        {isLoading && (
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner variant="ring" size="xl" />
          </div>
        )}
        {data && (
          <>
            {data.map((item: any) => (
              <Card
                key={item._id}
                _id={item._id}
                title={
                  item.save_type
                    ? item.save_type === "full_page"
                      ? item.title
                      : item.selected_text
                    : item.title
                }
                url={item.url}
                tags={item.tags}
                handleTagClick={(item) => {
                  if (!tagSearch.includes(item.toLowerCase())) {
                    setTagSearch([...tagSearch, item]);
                  }
                }}
                handleDelete={handleDelete}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}
