import React, { useState, useEffect, useMemo } from "react";
import Card from "../components/Card.js";
import { useAuth, useUser, SignOutButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "@/components/SearchBar.js";
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
import { useQueryClient } from "@tanstack/react-query";

interface CollectionData {
  _id: string;
  user_id: string;
  name: string;
  created_at: Date;
  color: string;
}

// TODO: migrate to tanstack query

export default function HomePage() {
  const queryClient = useQueryClient();

  const deleteLink = useDeleteLink();

  // state for storing data
  // const [data, setData] = useState<any[]>([]);
  const { data: data, isPending: isLoading, isError: error } = useLinks();
  // const [error, setError] = useState<string>("");

  // const [isLoading, setIsLoading] = useState(false);

  // this is managed SearchBar component
  const [tagSearch, setTagSearch] = useState<string[]>([]);

  const { data: collections = [] } = useCollections();
  const [searchParams, setSearchParams] = useSearchParams();
  const collectionFromUrl = searchParams.get("collection") || "all";

  // Use that as your initial state
  const [selectedCollection, setSelectedCollection] =
    useState(collectionFromUrl);

  // provides access to the current user's authentication state and methods to manage the active session.
  const { getToken } = useAuth();

  // this hook sends the jwt to the extention. content.js --> background.js --> local storage
  useEffect(() => {
    const sendJWTToExtension = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.warn("No token found");
          return;
        }
        window.postMessage({ type: "FROM_PAGE", token }, "*");
      } catch (error) {
        console.error("Error getting clerk token", error);
      }
    };
    sendJWTToExtension();
  }, [getToken]);

  useEffect(() => {
    const urlValue = searchParams.get("collection") || "all";
    setSelectedCollection(urlValue);
  }, [searchParams]);

  // for page navigation
  const navigate = useNavigate();

  // provides access to the current user's User object
  const { user } = useUser();

  // ? this must be a protected route?
  // handling delete
  const handleDelete = async (_id: string) => {
    const isdeleted = await deleteLink.mutateAsync({ id: _id });
    if (isdeleted) {
      console.log("Deleted");
    }
  };

  const filteredData = useMemo(() => {
    if (selectedCollection === "all") return data;
    return data.filter((item: any) => item?.folder_id === selectedCollection);
  }, [data, selectedCollection, collections]);

  return (
    <>
      <div className="flex mt-6 mr-6 gap-5 justify-end place-items-center">
        <Button
          onClick={() => {
            navigate("/");
          }}>
          Go to Home
        </Button>
        {/* <SearchBar
          setError={setError}
          setSearchData={setData}
          tags={tagSearch}
          setTag={setTagSearch}
          setLoading={setIsLoading}
        /> */}
        <SignOutButton>
          <Button
            onClick={() => {
              window.postMessage({ type: "SIGN_OUT" }, "*");
            }}>
            Sign out
          </Button>
        </SignOutButton>

        <Button
          onClick={() => {
            navigate("/profile");
          }}>
          View Profile
        </Button>
        <Select
          value={selectedCollection}
          onValueChange={(value) => {
            setSelectedCollection(value);
            setSearchParams({ collection: value });
          }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by collection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            {collections?.map((collection: any) => (
              <SelectItem key={collection._id} value={collection._id}>
                {collection.name.charAt(0).toUpperCase() +
                  collection.name.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-bold">Hello {user?.fullName} </h1>
      </div>
      <div className="pl-5">
        <p>Total Links: {Array.isArray(data) ? data.length : 0}</p>
        <p>
          Filtered Links:{" "}
          {Array.isArray(filteredData) ? filteredData.length : 0}
        </p>
        <p>Selected Collection: {selectedCollection}</p>
      </div>
      <div className="p-10 flex gap-0.5 justify-evenly items-center flex-wrap">
        {error && <div className="text-gray-500 text-center mt-4">{error}</div>}
        {isLoading && (
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner variant="ring" size="xl" />
          </div>
        )}
        {!isLoading && <AddNote />}
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
                handleTagClick={(item) => {
                  if (!tagSearch.includes(item.toLowerCase())) {
                    setTagSearch([...tagSearch, item]);
                  }
                }}
                handleDelete={handleDelete}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}
