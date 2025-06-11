import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import TagList from "./TagList";

interface SearchBarProps {
  setSearchData: (value: React.SetStateAction<never[]>) => void;
  setError: (value: React.SetStateAction<string>) => void;
  tags: string[];
  setTag: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function SearchBar({
  setSearchData,
  setError,
  tags,
  setTag,
}: SearchBarProps) {
  const { getToken } = useAuth();

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
      const token = await getToken();

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
  }, [tags]);

  return (
    <>
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
      <TagList tags={tags} handleTagDelete={handleTagDelete} />
    </>
  );
}
