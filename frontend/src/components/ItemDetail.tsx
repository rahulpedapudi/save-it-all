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
  handleSummary: () => Promise<void>;
}

export default function ItemDetail({
  _id,
  title,
  url,
  folder_id,
  tags,
  summary,
  note,
  handleSummary,
}: ItemDetailProps) {
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl mb-4 font-bold">{title}</h1>
          <a className="underline text-blue-400" target="_blank" href={url}>
            {url}
          </a>
          <Folder linkId={_id} linkCollectionId={folder_id} />
        </div>
        {summary == "" ? (
          <Button onClick={handleSummary}>Summarise</Button>
        ) : null}
      </div>
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
