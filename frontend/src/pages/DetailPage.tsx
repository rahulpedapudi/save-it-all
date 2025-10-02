import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UpdateForm from "../components/UpdateForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import ItemDetail from "@/components/ItemDetail";
import NoteDetail from "@/components/NoteDetail";
import { useAuth } from "../contexts/AuthContext";

export default function DetailPage() {
  const { token } = useAuth();

  // gets _id from the parameters of the url - /detail/:_id
  const { _id } = useParams();

  //  the type for your data
  interface LinkData {
    _id: string;
    title: string;
    url: string;
    tags: string[];
    note: string;
    summary: string;
    folder_id: string;
    content_type: string;
    content: string;
    og_preview_image: string;
  }

  // state for data
  const [data, setData] = useState<LinkData | null>(null);

  const [isUpdateClicked, setIsUpdateClicked] = useState(false);

  const [noteContent, setNoteContent] = useState<string>("");

  const handleClick = () => {
    setIsUpdateClicked((prev) => !prev);
  };

  const handleUpdate = async (updatedData: any) => {
    try {
      const res = await fetch(`http://localhost:5000/api/links/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const updatedData = await fetch(
          `http://localhost:5000/api/links/${_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedJson = await updatedData.json();
        setData(updatedJson);
        setIsUpdateClicked(false);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  // fetching data from the links/id endpoint for detailed view of the link.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/links/${_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        setData(json);
        setNoteContent(json.content);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [_id]);

  // calls summary endpoint which summarises and saves the data to the database, and fetches the latest data from another endpoint and updating the data using setData() with the latest data.
  const handleSummary = async () => {
    try {
      await fetch(`http://localhost:5000/api/analyze/${_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedData = await fetch(
        `http://localhost:5000/api/links/${_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedJson = await updatedData.json();
      setData(updatedJson);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // if no data is fetched
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner variant="ring" size="xl" />
      </div>
    );
  }

  return (
    <>
      <div className="px-4 md:px-36 py-10">
        {data.content_type === "note" && (
          <NoteDetail
            _id={data._id}
            title={data.title}
            folder_id={data.folder_id}
            tags={data.tags}
            content={noteContent}
            setContent={setNoteContent}
          />
        )}

        {data.content_type === "" && (
          <ItemDetail
            _id={data._id}
            title={data.title}
            url={data.url}
            folder_id={data.folder_id}
            tags={data.tags}
            note={data.note}
            image_url={data.og_preview_image}
            handleSummary={handleSummary}
            summary={data.summary}
          />
        )}

        <div className="flex gap-3">
          <Button
            className="cursor-pointer"
            onClick={handleClick}
            type="button">
            Update
          </Button>

          <Button className="cursor-pointer" type="button">
            Enrich Link
          </Button>
        </div>

        {isUpdateClicked ? (
          <UpdateForm
            initialData={data}
            onClose={() => setIsUpdateClicked(false)}
            onUpdate={handleUpdate}
          />
        ) : null}
      </div>
    </>
  );
}
