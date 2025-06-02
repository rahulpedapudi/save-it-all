import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UpdateForm from "../components/UpdateForm";

export default function DetailPage() {
  // gets _id from the parameters of the url - /detail/:_id
  const { _id } = useParams();

  // Define the type for your data
  interface LinkData {
    _id: string;
    title: string;
    url: string;
    tags: string[];
    note: string;
    summary: string;
    [key: string]: any; // for any additional properties
  }

  // state for data
  const [data, setData] = useState<LinkData | null>(null);

  const [isUpdateClicked, setIsUpdateClicked] = useState(false);

  const handleClick = () => {
    setIsUpdateClicked((prev) => !prev);
  };

  const handleUpdate = async (updatedData: any) => {
    try {
      const res = await fetch(`http://localhost:5000/api/link/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const updatedData = await fetch(
          `http://localhost:5000/api/links/${_id}`
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
        const res = await fetch(`http://localhost:5000/api/links/${_id}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [_id]);

  // calls summary endpoint which summarises and saves the data to the database, and fetches the latest data from another endpoint and updating the data using setData() with the latest data.
  const handleSummary = async () => {
    try {
      await fetch(`http://localhost:5000/api/analyze/${_id}`);
      const updatedData = await fetch(`http://localhost:5000/api/links/${_id}`);
      const updatedJson = await updatedData.json();
      setData(updatedJson);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // if no data is fetched
  if (!data) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">{data.title}</h1>
          <a target="_blank" href={data.url}>
            {data.url}
          </a>
        </div>
        {data.summary == "" ? (
          <button
            onClick={handleSummary}
            className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4  origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800 h-16 w-64 border text-left p-3 text-gray-50 text-base font-bold rounded-lg  overflow-hidden  before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
            Summarise
          </button>
        ) : null}
      </div>
      <div className="m-4 flex gap-8 rounded-md">
        {!data || !data.tags || data.tags.length === 0 ? null : (
          <ul className="flex gap-2 flex-wrap">
            {data.tags.map((item, index) => (
              <li
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>{data.note}</div>
      <div className="border h-80 w-auto my-8 flex justify-center items-center">
        {data.summary ? (
          <h1 className="text-2xl font-bold">{data.summary}</h1>
        ) : (
          <h1 className="text-lg text-gray-500">
            Click "Summarize" to generate summary
          </h1>
        )}
      </div>
      <button
        onClick={handleClick}
        className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
        type="button">
        Update
      </button>
      {isUpdateClicked ? (
        <UpdateForm
          initialData={data}
          onClose={() => setIsUpdateClicked(false)}
          onUpdate={handleUpdate}
        />
      ) : null}
    </div>
  );
}
