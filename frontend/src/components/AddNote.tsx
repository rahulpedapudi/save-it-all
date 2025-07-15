// Todo: auto save after few changes
// Todo: mardown support
// Todo: autofetch data after note save
// Todo: ux after saving a note, sonner (shadcn)

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CloseLight from "../assets/Close_L.svg";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useAuth } from "../contexts/AuthContext";
import { useCollections } from "@/hooks/useCollection";
import { useCreateCollection } from "@/hooks/useCreateCollection";
import { useQueryClient } from "@tanstack/react-query";

interface CollectionData {
  _id: string;
  user_id: string;
  name: string;
  created_at: Date;
  color: string;
}

export default function AddNote() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [collection, setCollection] = useState("");

  const { data: collections = [] } = useCollections();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const createCollection = useCreateCollection();

  const handleSave = async () => {
    if (!token) {
      toast("Please log in to save notes");
      return;
    }

    const note = {
      title: title,
      content: content,
      tags: tags,
      folder_id: collection,
    };

    try {
      const response = await fetch("http://localhost:5000/api/save-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(note),
      });
      if (response.ok) {
        console.log(note);
        console.log(await response.json());
        toast("Note saved");
        setIsSheetOpen(false);
      }
    } catch (error) {
      console.warn(String(error));
    }
  };

  const handleCreateCollection = async () => {
    const trimmedName = newCollectionName.trim();
    setCollection(trimmedName);
    try {
      setIsSaving(true);
      if (trimmedName) {
        const response = await createCollection.mutateAsync({
          name: trimmedName,
        });

        if (response.collection) {
          await queryClient.invalidateQueries({ queryKey: ["collections"] });
        }
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsDialogOpen(false);
      setNewCollectionName("");
      setIsSaving(false);
    }
  };

  const handleTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.endsWith(" ")) {
      const trimmed = value.trim();
      if (trimmed && !tags?.includes(trimmed.toLowerCase())) {
        setTags([...(tags || []), trimmed]);
      }
      setTagInput("");
    } else {
      setTagInput(value);
    }
  };

  const handleTagDelete = (item: any) => {
    if (tags) {
      const filtered = tags.filter((tags) => tags !== item);
      setTags(filtered);
    }
  };

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" onClick={() => setIsSheetOpen(true)}>
            New Note
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full text-white sm:max-w-2xl p-6">
          <SheetHeader>
            <SheetTitle className="text-2xl font-semibold text-left">
              <Input
                className="text-3xl font-bold border-none focus-visible:ring-0 p-0 h-auto"
                placeholder="Untitled"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </SheetTitle>

            <div className="flex items-center gap-4 mt-2">
              <Input
                className="w-full max-w-xs"
                placeholder="Add tags (comma separated)"
                value={tagInput}
                onChange={handleTag}
              />
              <Select value={collection} onValueChange={setCollection}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections &&
                    collections.map((item: CollectionData) => (
                      <SelectItem key={item._id} value={item._id}>
                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                      </SelectItem>
                    ))}
                  <div
                    onClick={() => setIsDialogOpen(true)}
                    className="cursor-pointer px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md">
                    + Add a new collection
                  </div>
                </SelectContent>
              </Select>
            </div>
          </SheetHeader>

          <div>
            <ul className="flex">
              {tags && tags.length > 0
                ? tags.map((item, index) => (
                    <li
                      className="bg-blue-500 text-xs text-white px-3 py-1 rounded-full mr-1 flex items-center gap-2"
                      key={index}>
                      {item}
                      <button
                        role="button"
                        aria-label="close"
                        onClick={() => handleTagDelete(item)}>
                        <img
                          alt="close"
                          width="14px"
                          height="14px"
                          src={CloseLight}
                        />
                      </button>
                    </li>
                  ))
                : null}
            </ul>
          </div>
          <Textarea
            placeholder="Start writing your note here..."
            className="mt-6 h-[400px] resize-none text-base focus-visible:ring-0 border-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end mt-6 gap-2">
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </SheetContent>
      </Sheet>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>
              Enter a name for your new collection. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Projects, Notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isSaving} onClick={handleCreateCollection}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
