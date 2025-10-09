import { useState } from "react";
import TagList from "./TagList";
import { Input } from "./ui/input";

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
    // <div className="px-10 mb-6">
    //   <div className="relative max-w-3xl mx-auto w-full">
    //     <input
    //       type="text"
    //       placeholder="Search or add tags with #"
    //       value={searchInput}
    //       onChange={handleSearch}
    //       className="w-full px-5 py-3 rounded-xs border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 transition-all duration-200 shadow-sm focus:shadow-md"
    //     />
    //     {tags.length > 0 && (
    //       <div className="mt-3">
    //         <TagList tags={tags} handleTagDelete={handleTagDelete} />
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div className="px-6 md:px-10 mb-8">
      <div className="relative max-w-3xl mx-auto w-full">
        {/* Search Input with Icon */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search or add tags with #"
            value={searchInput}
            onChange={handleSearch}
          />
        </div>

        {/* Tags Display */}
        {tags.length > 0 && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <TagList tags={tags} handleTagDelete={handleTagDelete} />
          </div>
        )}
      </div>
    </div>
  );
}
