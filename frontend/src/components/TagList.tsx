import CloseIcon from "../assets/Close_L.svg";

interface TagListProps {
  tags: string[];
  handleTagDelete: (item: string) => void;
}

export default function TagList({ tags, handleTagDelete }: TagListProps) {
  return (
    <ul className="flex">
      {tags.length > 0
        ? tags.map((item, index) => (
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
  );
}
