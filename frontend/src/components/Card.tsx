import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CardProps = {
  _id: string;
  title: string;
  url: string;
  tags: string[];
  noteContent?: string;
  isFav: boolean;
  handleDelete: (_id: string) => Promise<void>;
  handleTagClick: (tag: string) => void;
  handleLike: (_id: string) => void;
};

function Card(props: CardProps) {
  const { token } = useAuth();

  // state used for confirmation popup
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  // const [isFav, setIsFav] = useState<boolean>(false);

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
    <>
      <div
        onClick={handleOpen}
        className="relative mt-3 w-[440px] h-[240px] border-2 border-black p-5 mb-6 rounded-[7px] overflow-hidden cursor-pointer 
           transition-all duration-300 ease-in-out 
           hover:-translate-y-1 hover:shadow-sm">
        <div className="mb-9">
          <h1 className="font-black font-sans-serif text-4xl line-clamp-2 overflow-hidden whitespace-normal break-words">
            {props.title}
          </h1>
          <p className="font-sans-serif py-4 text-gray-500 text-xs font-black">
            {props.tags[0]}
          </p>
        </div>
        <p className="line-clamp-4 overflow-hidden ">{props.noteContent}</p>
        <div>
          {props.tags && (
            <ul className="flex flex-wrap">
              {props.tags.map((item, index) => (
                <li
                  className="text-xs  text-black font-semibold py-1 rounded-full mr-2 flex items-center gap-2"
                  key={index}>
                  <button
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      props.handleTagClick(item);
                    }}
                    type="button">
                    {"#"}
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="absolute bottom-4 right-2">
          <div className="flex gap-2 items-center">
            <Button
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirm(true);
              }}>
              {" "}
              Delete
            </Button>
            <Button
              className="cursor-pointer "
              onClick={(e) => {
                e.stopPropagation();
                props.handleLike(props._id);
              }}>
              {props.isFav ? <Heart className="fill-red-700" /> : <Heart />}
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              item.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Card;
