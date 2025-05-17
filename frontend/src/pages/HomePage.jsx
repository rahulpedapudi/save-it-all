import React, { useState, useEffect } from "react";
import Card from "../components/Card";

export default function HomePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/links")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="p-10 flex justify-between items-center flex-wrap">
      {data ? (
        <>
          {data.map((item) => (
            <Card
              key={item._id}
              _id={item._id}
              title={item.title}
              url={item.url}></Card>
          ))}
        </>
      ) : (
        "loading"
      )}
    </div>
  );
}
