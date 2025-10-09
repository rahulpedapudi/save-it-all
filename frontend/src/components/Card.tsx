import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Delete, Heart, RemoveFormatting, Trash2 } from "lucide-react";
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
        className="group relative w-full max-w-[420px] h-[240px] bg-gradient-to-br from-white to-gray-50 
             border border-gray-200 rounded-b-lg rounded-t-lg p-5 mb-6 
             shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 ease-in-out hover:-translate-y-1 cursor-pointer">
        {/* Title + Primary Tag */}
        <div className="mb-3">
          <h1
            className="font-sans-serif text-2xl font-semibold text-gray-900 line-clamp-3 break-words 
                   group-hover:text-blue-600 transition-colors duration-200">
            {props.title}
          </h1>
          {props.tags?.[0] && (
            <p className="mt-1 text-[0.7rem] font-semibold text-blue-500 uppercase tracking-wider">
              {props.tags[0]}
            </p>
          )}
        </div>

        {/* Note Content */}
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-4 mb-4">
          {props.noteContent}
        </p>

        {/* Tags */}
        {props.tags && (
          <ul className="flex flex-wrap gap-2 mb-10">
            {props.tags.map((item, index) => (
              <li key={index}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    props.handleTagClick(item);
                  }}
                  type="button"
                  className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full 
                       hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                  #{item}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}>
            <Trash2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              props.handleLike(props._id);
            }}>
            {props.isFav ? (
              <Heart className="fill-red-500 stroke-red-500 transition-all duration-200" />
            ) : (
              <Heart className="stroke-gray-600 transition-all duration-200 group-hover:stroke-blue-600" />
            )}
          </Button>
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
