import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@clerk/clerk-react";
import { useCollections } from "@/hooks/useCollection";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateCollection } from "@/hooks/useCreateCollection";
import { useAssignCollection } from "@/hooks/useAssignCollection";
interface FolderProps {
  linkId: string | undefined;
  linkCollectionId: string | null;
}

export default function Folder({ linkId, linkCollectionId }: FolderProps) {
  interface CollectionData {
    _id: string;
    user_id: string;
    name: string;
    created_at: Date;
    color: string;
  }

  const { getToken } = useAuth();

  // state to show the currently selected collection
  const [selectedCollection, setSelectedCollection] = useState("");

  // todo: i should retrieve these from the backend db
  // const [collections, setCollections] = useState<CollectionData[]>([]);
  const { data: collections = [] } = useCollections();
  const createCollection = useCreateCollection();
  const assignCollection = useAssignCollection();

  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState(false);

  // const fetchCollections = async () => {
  //   if (isLoading) return;
  //   setIsLoading(true);

  //   try {
  //     const token = await getToken();
  //     if (!token) {
  //       setError("Authentication required");
  //       return;
  //     }

  //     const response = await fetch("http://localhost:5000/collections/get", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const results = await response.json();

  //     if (response.ok && results.collections) {
  //       setCollections(results.collections);

  //       if (linkCollectionId) {
  //         const found = results.collections.find(
  //           (c: CollectionData) => c._id === linkCollectionId
  //         );
  //         setSelectedCollection(found ? found.name : "");
  //       }
  //       setError("");
  //     } else {
  //       setError(results.message || "No Collections");
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error: ", error);
  //     setError("Network Error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    // fetchCollections();
    if (collections.length > 0 && linkCollectionId) {
      const found = collections.find(
        (c: CollectionData) => c._id === linkCollectionId
      );
      setSelectedCollection(found ? found.name : "");
    }
  }, [collections, linkCollectionId]);

  const handleCreateCollection = async () => {
    const trimmedName = newCollectionName.trim();
    if (trimmedName) {
      try {
        setIsSaving(true);
        const resoponse = await createCollection.mutateAsync({
          name: trimmedName,
        });

        if (resoponse.collection && linkId) {
          const isAssigned = await assignCollection.mutateAsync({
            linkId: linkId,
            collectionId: resoponse._id,
          });

          if (isAssigned) {
            await queryClient.invalidateQueries({ queryKey: ["collections"] });
            setSelectedCollection(trimmedName);
            setNewCollectionName("");
            setIsDialogOpen(false);
          } else {
            setError("Created Collection but failed to assign");
          }
        } else {
          setError("Failed to create Collection");
        }
      } catch (error) {
        console.error("Create Collection error: ", error);
        setError("Failed to create Collection");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCollectionChange = async (collectionName: string) => {
    setSelectedCollection(collectionName);

    const selected = collections.find(
      (c: CollectionData) => c.name === collectionName
    );
    if (!selected) return;

    try {
      const token = await getToken();

      const isAssigned = await assignCollection.mutateAsync({
        linkId: linkId,
        collectionId: selected._id,
      });

      if (!isAssigned) {
        const found = collections.find(
          (c: CollectionData) => c._id === linkCollectionId
        );
        setSelectedCollection(found ? found.name : "");
        setError("Failed to assign to collection");
      }
    } catch (error) {
      const found = collections.find(
        (c: CollectionData) => c._id === linkCollectionId
      );
      setSelectedCollection(found ? found.name : "");
      setError("Network error");
    }
  };

  return (
    <>
      <Select
        value={selectedCollection}
        onValueChange={handleCollectionChange}
        disabled={isLoading}>
        <SelectTrigger className="w-[200px]">
          <SelectValue
            placeholder={isLoading ? "Loading..." : "Add to collection"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Your Collections</SelectLabel>

            {collections &&
              collections.map((item: CollectionData) => (
                <SelectItem key={item._id} value={item.name}>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  {/* {item.name} */}
                </SelectItem>
              ))}

            {/* Custom "Add new" option */}
            <div
              onClick={() => setIsDialogOpen(true)}
              className="cursor-pointer px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md">
              + Add a new collection
            </div>
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <h1>{error}</h1>}

      {/* Dialog Outside Select */}
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
