import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";

type CardProps = {
  _id: string;
  title: string;
  url: string;
  tags: string[];
  noteContent?: string;
  handleDelete: (_id: string) => Promise<void>;
  handleTagClick: (tag: string) => void;
};

function Card(props: CardProps) {
  // state used for confirmation popup
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  // navigate programmatically in the browser in response to user interactions or effect
  const navigate = useNavigate();

  // navigates to the detailed view of the link
  const handleOpen = () => {
    navigate(`/detail/${props._id}`);
  };

  const confirmDelete = () => {
    props.handleDelete(props._id);
    setShowConfirm(false);
  };

  return (
    <div className=" relative w-72 h-64 border-2 p-4 mb-6 box-border border-black overflow-hidden">
      <div className="mb-9">
        <h1 className="font-bold text-2xl line-clamp-2 overflow-hidden whitespace-normal break-words">
          {props.title}
        </h1>
      </div>
      <p className="line-clamp-4 overflow-hidden ">{props.noteContent}</p>
      <div>
        {props.tags && (
          <ul className="flex flex-wrap">
            {props.tags.map((item, index) => (
              <li
                className="bg-blue-500 text-xs text-white px-3 py-1 rounded-full mr-1 flex items-center gap-2"
                key={index}>
                <button
                  className="cursor-pointer"
                  onClick={() => props.handleTagClick(item)}
                  type="button">
                  {item}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="absolute bottom-4 right-2">
        <div className="flex gap-2 items-center">
          <Button onClick={() => setShowConfirm(true)}> Delete</Button>
          <Button onClick={handleOpen}> Open</Button>
          <Button onClick={() => {}}>
            <Heart />
          </Button>
        </div>
      </div>
      {showConfirm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4">Are you sure you want to delete this? </p>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border">
                Cancel
              </Button>
              <Button onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
