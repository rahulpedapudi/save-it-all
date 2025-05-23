import { useEffect, useState } from "react";
import CloseLight from "../assets/Close_L.svg";
import { useNavigate } from "react-router-dom";
import AppBar from "../components/AppBar";

export default function InitialPage({ onSave }) {
  const navigate = useNavigate();

  const [tabInfo, setTabInfo] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const [note, setNote] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      setTabInfo({
        id: tab.id,
        title: tab.title,
        url: tab.url,
      });
    });
  }, []);

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);

    const updatedTabInfo = {
      ...tabInfo,
      tags,
      note,
    };

    try {
      await onSave(updatedTabInfo, navigate);
    } catch (error) {
      navigate("/error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTag = (e) => {
    const value = e.target.value;
    if (value.endsWith(" ")) {
      const trimmed = value.trim();
      if (trimmed && !tags.includes(trimmed.toLowerCase())) {
        setTags([...tags, trimmed]);
      }
      setTagInput("");
    } else {
      setTagInput(value);
    }
  };

  const handleTagDelete = (item) => {
    const filtered = tags.filter((tags) => tags !== item);
    setTags(filtered);
  };

  return (
    <div className="w-[400px]  p-[20px] m-auto border-2">
      <AppBar />
      <section className="font-body link-info mb-4">
        <h1 id="title-display" className=" page-title text-3xl font-bold mb-2">
          {tabInfo?.title}
        </h1>
        <a
          href=""
          id="url-display"
          className="block w-full hover: underline truncate text-lg text-blue-500 font-bold">
          {tabInfo?.url}
        </a>
        <button
          id="primary-btn"
          className={`w-full h-12 mt-4 text-lg rounded-[5px] font-bold text-saveit-light ${
            isSaving ? "opacity-70 cursor-not-allowed" : ""
          } ${isSaving ? "bg-gray-700" : "bg-saveit-dark"} relative`}
          onClick={handleSave}
          disabled={isSaving}
          type="button">
          {isSaving ? (
            <>
              <span className="flex items-center justify-center">
                {" "}
                Saving
                <span className="flex ml-1">
                  {" "}
                  <span
                    className="inline-block animate-saving-dot-bounce mx-[0.5px]" // mx for tiny horizontal space
                    style={{ animationDelay: "0s" }} // Start immediately
                  >
                    .
                  </span>
                  <span
                    className="inline-block animate-saving-dot-bounce mx-[0.5px]"
                    style={{ animationDelay: "0.3s" }} // Start after 0.3 seconds
                  >
                    .
                  </span>
                  <span
                    className="inline-block animate-saving-dot-bounce mx-[0.5px]"
                    style={{ animationDelay: "0.6s" }} // Start after 0.6 seconds
                  >
                    .
                  </span>
                </span>
              </span>
            </>
          ) : (
            "Save Page"
          )}
        </button>
      </section>

      <section className="font-body tags mb-4">
        <form action="">
          <label className="text-lg font-bold" htmlFor="tags">
            Tags
          </label>
          <br />
          <input
            className="border-2 w-full h-10 p-4 text-xs mb-2"
            type="text"
            name="Tags"
            id="Tags"
            value={tagInput}
            onChange={handleTag}
            placeholder="Add Tags (e.g./ productivity, AI, research)"
          />
        </form>
        <div>
          <ul className="flex">
            {tags.length > 0
              ? tags.map((item, index) => (
                  <li
                    className="bg-blue-500 text-xs text-white px-3 py-1 rounded-full mr-1 flex items-center gap-2"
                    key={index}>
                    {item}
                    <button onClick={() => handleTagDelete(item)}>
                      <img width="14px" height="14px" src={CloseLight} />
                    </button>
                  </li>
                ))
              : null}
          </ul>
        </div>
      </section>

      <section className="note font-body">
        <form action="">
          <label className="text-lg font-bold" htmlFor="note">
            Note
          </label>
          <br />
          <textarea
            className="border-2 w-full text-xs h-full p-4 mb-2"
            type="text"
            name="note"
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a personal note or context.."
          />
        </form>
      </section>
    </div>
  );
}
