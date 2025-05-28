import React, { useState, useEffect } from "react";
import Card from "../components/Card.js";

export default function HomePage() {
  // state for storing data
  const [data, setData] = useState([]);

  // calling the endpoint which fetches all links
  useEffect(() => {
    fetch("http://localhost:5000/api/links")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, []);

  // handling delete
  const handleDelete = async (_id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/links/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // updating the UI by filtering out the item that has been deleted currently.
      if (res.ok) {
        setData((prev: any) => prev.filter((item: any) => item._id !== _id));
      } else {
        console.error("Delete Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-10 flex justify-evenly items-center flex-wrap">
      {data ? (
        <>
          {data.map((item: any) => (
            <Card
              key={item._id}
              _id={item._id}
              title={item.title}
              url={item.url}
              handleDelete={handleDelete}
            />
          ))}
        </>
      ) : (
        "loading"
      )}
    </div>
  );
}
