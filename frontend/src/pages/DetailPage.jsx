import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DetailPage() {
  const { _id } = useParams();
  const [data, setData] = useState(null);

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
  }, []);

  if (!data) {
    return <div className="p-4">Loading...</div>;
  }

  // Optional: Handle error returned from API
  if (data.error) {
    return <div className="p-4 text-red-500">{data.error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <p>{data.url}</p>
      <div>
        <p>tags</p>
      </div>
      <div className="flex gap-4">
        <button>Update</button>
      </div>
    </div>
  );
}
