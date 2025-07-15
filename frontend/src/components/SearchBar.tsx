import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import TagList from "./TagList";

interface SearchBarProps {
  setSearchData: React.Dispatch<React.SetStateAction<any[]>>;
  setError: (value: React.SetStateAction<string>) => void;
  tags: string[];
  setTag: React.Dispatch<React.SetStateAction<string[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SearchBar({
  setSearchData,
  setError,
  tags,
  setTag,
  setLoading,
}: SearchBarProps) {
  const { token } = useAuth();

  // states for search and errors
  const [searchInput, setSearchInput] = useState<string>("");

  const handleTagDelete = (item: string) => {
    const filtered = tags.filter((tag) => tag !== item);
    setTag(filtered);
  };

  // the words which starts with '#' is considered as tag and used for searching
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.endsWith(" ")) {
      if (value.startsWith("#")) {
        const trimmed_value = value.trim();

        // making sure every tag is unique
        if (trimmed_value && !tags.includes(trimmed_value.toLowerCase())) {
          setTag([...tags, trimmed_value.substring(1).toLowerCase()]); // removing the '#'
        }
        setSearchInput("");
      } else {
        setSearchInput(value);
      }
    } else {
      setSearchInput(value);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("No authentication token");
        return;
      }

      const queryParams = tags
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
        setSearchData(result.links);
      } else {
        setError("Something went wrong");
      }
    };

    fetchData();
  }, [tags, token, setSearchData, setError]);

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Search or add tags with #"
        value={searchInput}
        onChange={handleSearch}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {tags.length > 0 && (
        <TagList tags={tags} handleTagDelete={handleTagDelete} />
      )}
    </div>
  );
}
