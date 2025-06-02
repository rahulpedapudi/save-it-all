import React, { useState, useEffect } from "react";
import Card from "../components/Card.js";
import { Button } from "@/components/ui/button";
import { resourceLimits } from "worker_threads";

export default function HomePage() {
  // state for storing data
  const [data, setData] = useState([]);

  // calling the endpoint which fetches all links
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/links");
        const results = await response.json();

        if (response.status === 200) {
          setData(results.links);
          if (results.links.length === 0) {
            setError(results.message || "No posts");
          } else {
            setError("");
          }
        }
      } catch (error) {
        setError("Something went wrong. Try again after sometime.");
      }
    };

    fetchData();
  }, []);

  // handling delete
  const handleDelete = async (_id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/links/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
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
          setTagSearch([...tagSearch, trimmed_value.substring(1)]); // removing the '#'
        }
        setSearchInput("");
      } else {
        setSearchInput(value);
      }
    } else {
      setSearchInput(value);
    }
  };

  const handleSearchSubmit = async () => {
    // url example: /api/links?tags=tech&coding
    const queryParams = tagSearch
      .map((tag) => `tags=${encodeURIComponent(tag)}`)
      .join("&");
    const url = `http://localhost:5000/api/links?${queryParams}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    if (res.status == 200) {
      setData(result.links);
      if (result.links.length === 0) {
        setError(result.message || "No Posts found.");
      } else {
        setError("");
      }
    } else {
      setError("Something went wrong");
    }
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
        <Button onClick={handleSearchSubmit}>Search</Button>
      </div>
      <div>
        <ul className="flex">
          {tagSearch.length > 0
            ? tagSearch.map((item, index) => (
                <li
                  className="bg-blue-500 text-xs text-white px-3 py-1 rounded-full mr-1 flex items-center gap-2"
                  key={index}>
                  {item}
                </li>
              ))
            : null}
        </ul>
      </div>
      <div className="p-10 flex justify-evenly items-center flex-wrap">
        {error && <div className="text-gray-500 text-center mt-4">{error}</div>}
        {data.length > 0 && (
          <>
            {data.map((item: any) => (
              <Card
                key={item._id}
                _id={item._id}
                title={item.title}
                url={item.url}
                handleDelete={handleDelete}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}
