import React, { useState, useEffect, useMemo } from "react";
import Card from "../components/Card.js";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar.js";
import LoadingSpinner from "@/components/LoadingSpinner.js";
import { useCollections } from "@/hooks/useCollection.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddNote from "@/components/AddNote.js";
import { useLinks } from "@/hooks/useLinks.js";
import { useDeleteLink } from "@/hooks/useDeleteLink.js";
import { useUpdateFav } from "@/hooks/useUpdateFav.js";

interface CollectionData {
  _id: string;
  user_id: string;
  name: string;
  created_at: Date;
  color: string;
}

export default function HomePage() {
  const deleteLink = useDeleteLink();
  const updateFav = useUpdateFav();

  const [tagSearch, setTagSearch] = useState<string[]>([]);
  const { data, isPending: isLoading, isError, error } = useLinks(tagSearch);

  const { data: collections = [] } = useCollections();
  const [searchParams, setSearchParams] = useSearchParams();
  const collectionFromUrl = searchParams.get("collection") || "all";

  const [selectedCollection, setSelectedCollection] =
    useState(collectionFromUrl);

  const { token, logout, user } = useAuth();

  useEffect(() => {
    const sendJWTToExtension = async () => {
      try {
        if (!token) {
          console.warn("No token found");
          return;
        }
        window.postMessage({ type: "FROM_PAGE", token }, "*");
      } catch (error) {
        console.error("Error getting token", error);
      }
    };
    sendJWTToExtension();
  }, [token]);

  useEffect(() => {
    const urlValue = searchParams.get("collection") || "all";
    setSelectedCollection(urlValue);
  }, [searchParams]);

  const navigate = useNavigate();

  const handleDelete = async (_id: string) => {
    const isdeleted = await deleteLink.mutateAsync({ id: _id });
    if (isdeleted) {
      console.log("Deleted");
    }
  };

  const handleLike = (linkId: string) => {
    updateFav.mutate({ linkId, tags: tagSearch });
  };

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (selectedCollection === "all") return data;
    return data.filter((item: any) => item?.folder_id === selectedCollection);
  }, [data, selectedCollection]);

  return (
    <>
      <div className="p-10">
        <h1 className="font-bold font-sans-serif text-3xl">SaveIt Box</h1>
      </div>
      <div className="px-10">
        <SearchBar tags={tagSearch} onTagsChange={setTagSearch} />
      </div>
      {/* <AddNote /> */}
      <div className="px-10 flex justify-between items-center flex-wrap">
        {isError && (
          <div className="text-gray-500 text-center mt-4">{error.message}</div>
        )}
        {isLoading && (
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner variant="ring" size="xl" />
          </div>
        )}
        {filteredData && !isLoading && (
          <>
            {filteredData.map((item: any) => (
              <Card
                key={item._id}
                _id={item._id}
                title={
                  item.save_type
                    ? item.save_type === "full_page"
                      ? item.title
                      : item.selected_text
                    : item.title
                }
                noteContent={item?.content}
                url={item.url}
                tags={item.tags}
                isFav={item.is_favorite}
                handleTagClick={(tag) => {
                  if (!tagSearch.includes(tag.toLowerCase())) {
                    setTagSearch([...tagSearch, tag]);
                  }
                }}
                handleDelete={handleDelete}
                handleLike={handleLike}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}
