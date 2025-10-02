import Folder from "@/components/Folder";
import { Button } from "./ui/button";

interface ItemDetailProps {
  _id: string;
  title: string;
  url: string;
  folder_id: string;
  tags: string[];
  summary: string;
  note: string;
  image_url: string;
  handleSummary: () => Promise<void>;
}

export default function ItemDetail({
  _id,
  title,
  url,
  folder_id,
  tags,
  summary,
  image_url,
  note,
  handleSummary,
}: ItemDetailProps) {
  return (
    <div>
      {image_url ? (
        <div className="flex justify-center">
          <div className="w-full h-auto rounded-xl overflow-hidden shadow-md mb-6">
            <img
              src={image_url}
              alt="thumbnail"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      ) : null}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-4 font-bold">{title}</h1>
        </div>
        <div className="flex gap-3 justify-center items-baseline">
          <a
            className="underline text-blue-400 mb-2"
            target="_blank"
            href={url}>
            Show Original
          </a>

          {summary == "" ? (
            <Button onClick={handleSummary}>Summarise</Button>
          ) : null}
        </div>
      </div>

      <Folder linkId={_id} linkCollectionId={folder_id} />

      <div className="m-4 flex gap-8 rounded-md">
        {tags && (
          <ul className="flex gap-2 flex-wrap">
            {tags.map((item, index) => (
              <li
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>{note}</div>
      <div className="h-auto w-auto my-8 flex justify-center items-center">
        {summary ? (
          <h1 className="text-2xl font-bold">{summary}</h1>
        ) : (
          <h1 className="text-lg text-gray-500">
            Click "Summarize" to generate summary
          </h1>
        )}
      </div>
    </div>
  );
}
