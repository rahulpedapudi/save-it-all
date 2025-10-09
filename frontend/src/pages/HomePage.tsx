import React, { useState, useEffect, useMemo } from "react";
import Card from "../components/Card.js";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar.js";
import LoadingSpinner from "@/components/LoadingSpinner.js";
import { useCollections } from "@/hooks/useCollection.js";
import AddNote from "@/components/AddNote.js";
import { useLinks } from "@/hooks/useLinks.js";
import { useDeleteLink } from "@/hooks/useDeleteLink.js";
import { useUpdateFav } from "@/hooks/useUpdateFav.js";
import CustomPagination from "@/components/Pagination.js";

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

  const [page, setPage] = useState(1);

  const [tagSearch, setTagSearch] = useState<string[]>([]);
  const {
    data,
    isPending: isLoading,
    isError,
    error,
  } = useLinks(tagSearch, page, 12);

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
    if (selectedCollection === "all") return data.links;
    return data.filter((item: any) => item?.folder_id === selectedCollection);
  }, [data, selectedCollection]);

  return (
    <section className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        {/* Header + Search in one row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="font-sans-serif text-3xl md:text-4xl font-bold text-gray-900">
            SaveIt Box
          </h1>

          {/* Right-aligned search bar */}
          <div className="w-full md:w-[340px]">
            <SearchBar tags={tagSearch} onTagsChange={setTagSearch} />
          </div>
        </div>

        {/* Masonry layout */}
        <div className="px-6 md:px-10">
          {isError && (
            <div className="text-gray-500 text-center mt-6">
              {error.message}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center h-[60vh]">
              <LoadingSpinner variant="ring" size="xl" />
            </div>
          )}

          {!isLoading && filteredData && filteredData.length > 0 && (
            <div
              className="
        columns-1 sm:columns-2 lg:columns-3 xl:columns-4
        gap-6 space-y-6
      ">
              {filteredData.map((item: any) => (
                <div key={item._id} className="break-inside-avoid">
                  <Card
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
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredData?.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              No items found. Try saving something new!
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-10 flex justify-center">
          <CustomPagination
            currentPage={page}
            totalPages={data?.pages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </section>
  );
}
