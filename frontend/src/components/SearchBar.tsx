import { useState } from "react";
import TagList from "./TagList";

interface SearchBarProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function SearchBar({ tags, onTagsChange }: SearchBarProps) {
  const [searchInput, setSearchInput] = useState<string>("");

  const handleTagDelete = (item: string) => {
    const filtered = tags.filter((tag) => tag !== item);
    onTagsChange(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.endsWith(" ")) {
      if (value.startsWith("#")) {
        const trimmed_value = value.trim();
        if (trimmed_value && !tags.includes(trimmed_value.toLowerCase())) {
          onTagsChange([...tags, trimmed_value.substring(1).toLowerCase()]);
        }
        setSearchInput("");
      } else {
        setSearchInput(value);
      }
    } else {
      setSearchInput(value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Search or add tags with #"
        value={searchInput}
        onChange={handleSearch}
        className="px-4 py-2 my-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {tags.length > 0 && (
        <TagList tags={tags} handleTagDelete={handleTagDelete} />
      )}
    </div>
  );
}
