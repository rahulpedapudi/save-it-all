import React, { useState, useEffect } from "react";
import Card from "../components/Card.js";
import CloseIcon from "../assets/Close_L.svg";
import {
  useAuth,
  useUser,
  SignOutButton,
  UserProfile,
  SignedIn,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button.js";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  // state for storing data
  const [data, setData] = useState([]);

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
      try {
        const token = await getToken();
        const response = await fetch("http://localhost:5000/api/links", {
          headers: {
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

  // states for search and errors
  const [searchInput, setSearchInput] = useState<string>("");
  const [tagSearch, setTagSearch] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  // the words which starts with '#' is considered as tag and used for searching
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.endsWith(" ")) {
      if (value.startsWith("#")) {
        const trimmed_value = value.trim();

        // making sure every tag is unique
        if (trimmed_value && !tagSearch.includes(trimmed_value.toLowerCase())) {
          setTagSearch([
            ...tagSearch,
            trimmed_value.substring(1).toLowerCase(),
          ]); // removing the '#'
        }
        setSearchInput("");
      } else {
        setSearchInput(value);
      }
    } else {
      setSearchInput(value);
    }
  };

  // ? idk if this is a good idea
  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();

      const queryParams = tagSearch
        .map((tag) => `tags=${encodeURIComponent(tag)}`)
        .join("&");
      const url = `http://localhost:5000/api/links?${queryParams}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok) {
        setData(result.links);
      } else {
        setError("Something went wrong");
      }
    };

    fetchData();
  }, [tagSearch]);

  const handleTagDelete = (item: string) => {
    const filtered = tagSearch.filter((tags) => tags !== item);
    setTagSearch(filtered);
  };

  return (
    <>
      <div className="flex mt-6 mr-6 gap-5 justify-end place-items-center">
        <form action="">
          <label htmlFor="search">Search</label>
          <br />
          <input
            className="border-2 w-72 h-10 p-4 text-md mb-2"
            type="search"
            name="search"
            id="search"
            value={searchInput}
            onChange={handleSearch}
            placeholder="search for links"
          />
        </form>
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
      <div>
        <ul className="flex">
          {tagSearch.length > 0
            ? tagSearch.map((item, index) => (
                <li
                  className="bg-blue-500 text-xs text-white px-3 py-1 rounded-full mr-1 flex items-center gap-2"
                  key={index}>
                  {item}
                  <button
                    type="button"
                    onClick={() => handleTagDelete(item)}
                    title="Remove tag">
                    <img
                      width="14px"
                      height="14px"
                      src={CloseIcon}
                      alt="Remove tag"
                    />
                  </button>
                </li>
              ))
            : null}
        </ul>
      </div>
      <div className="p-10 flex justify-evenly items-center flex-wrap">
        {error && <div className="text-gray-500 text-center mt-4">{error}</div>}
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
