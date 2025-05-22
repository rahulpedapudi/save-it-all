import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DetailPage() {
  // gets _id from the parameters of the url - /detail/:_id
  const { _id } = useParams();

  // state for data
  const [data, setData] = useState(null);

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

  // Optional: Handle error returned from API
  if (data.error) {
    return <div className="p-4 text-red-500">{data.error}</div>;
  }

  // ? what details should i render?
  // TODO: display tags, summary, topImage, metadata?

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
      <div className="border h-80 w-auto my-8 flex justify-center items-center">
        {data.summary ? (
          <h1 className="text-2xl font-bold">{data.summary}</h1>
        ) : (
          <h1 className="text-lg text-gray-500">
            Click "Summarize" to generate summary
          </h1>
        )}
      </div>

      <div className="flex gap-4">
        <button className="inline-block  text-black cursor-pointer items-center justify-center rounded-md border-[1.58px] border-zinc-600  px-5 py-3 font-medium shadow-md transition-all duration-300 hover:[transform:translateY(-.335rem)] hover:shadow-xl">
          Update
        </button>
      </div>
    </div>
  );
}
