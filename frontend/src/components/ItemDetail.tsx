import Folder from "@/components/Folder";
import { Button } from "./ui/button";
import { useState } from "react";
import { ExternalLink, Sparkles, Edit } from "lucide-react";

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
  onUpdateClick: () => void;
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
  onUpdateClick,
}: ItemDetailProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="px-6 md:px-12 lg:px-24 py-8">
      {/* Top Section: Thumbnail + Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Thumbnail */}
        {image_url && (
          <div className="col-span-1">
            <div className="w-full rounded-xl overflow-hidden shadow-md border border-gray-200">
              <img
                src={image_url}
                alt="thumbnail"
                className="w-full h-60 object-cover"
              />
            </div>
          </div>
        )}

        {/* Info */}
        <div
          className={`${
            image_url ? "col-span-2" : "col-span-3"
          } flex flex-col justify-between`}>
          <div>
            <h1 className="text-5xl font-sans-serif font-bold mb-3 text-gray-900">
              {title}
            </h1>
            <div className="text-sm text-gray-500 mb-4">
              <Folder linkId={_id} linkCollectionId={folder_id} />
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-4">
            <Button asChild variant="outline">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                <span>View Original</span>
              </a>
            </Button>
            <Button
              onClick={onUpdateClick}
              variant="outline"
              className="inline-flex items-center gap-2 cursor-pointer">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button
              disabled={isActive}
              onClick={() => {
                handleSummary();
                setIsActive(true);
              }}
              className="cursor-pointer rounded-full">
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Grid - Note and Summary Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Note Section */}
        {note && (
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
            <h2 className="text-base font-semibold text-amber-900 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              Note
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">{note}</p>
          </div>
        )}

        {/* Summary Section */}
        <div
          className={`p-5 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl shadow-sm ${
            !note ? "lg:col-span-2" : ""
          }`}>
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            AI Summary
          </h2>
          {summary ? (
            <p className="text-gray-800 leading-relaxed text-sm">{summary}</p>
          ) : (
            <p className="text-gray-500 italic text-sm">
              Click "Enrich Link" to generate an AI-powered summary
            </p>
          )}
        </div>
      </div>

      {/* Website Preview */}
      {url && (
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md bg-white">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
              Website Preview
            </h2>
          </div>
          <iframe
            title={`Content from ${title}`}
            src={url}
            className="w-full h-[600px]"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      )}
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/LX_4HSqMX5g?si=ERUPfDKWWvDzZuZL"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen></iframe>
    </div>
  );
}
