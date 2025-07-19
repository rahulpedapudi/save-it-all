import Folder from "./Folder";

interface NoteDetailProps {
  _id: string;
  title: string;
  folder_id: string;
  tags: string[];
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

export default function NoteDetail({
  _id,
  title,
  tags,
  content,
  folder_id,
  setContent,
}: NoteDetailProps) {
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl mb-4 font-bold">{title}</h1>
          <Folder linkId={_id} linkCollectionId={folder_id} />
        </div>
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
      <div className="h-auto w-auto my-8 flex justify-center items-center">
        <textarea
          title="note"
            className="h-[400px] w-full outline-none resize-none focus-visible:ring-0 border-none text-lg"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
