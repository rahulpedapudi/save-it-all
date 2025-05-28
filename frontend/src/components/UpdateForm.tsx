import { useState } from "react";

interface UpdateFormProps {
  initialData: {
    title?: string;
    url?: string;
    note?: string;
    tags?: string[];
  };
  onUpdate: (data: {
    title: string;
    url: string;
    note: string;
    tags: string[];
  }) => void;
  onClose: () => void;
}

interface UpdateFormData {
  title: string;
  url: string;
  note: string;
  tags: string;
}

export default function UpdateForm({
  initialData,
  onUpdate,
  onClose,
}: UpdateFormProps) {
  // initial data for displaying in the form: initialData prop
  const [formData, setFormData] = useState<UpdateFormData>({
    title: initialData.title || "",
    url: initialData.url || "",
    note: initialData.note || "",
    tags: (initialData.tags || []).join(", "), // Convert array to comma-separated string
  });

  // handling any changes in the form and changing the state of formData.

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev: UpdateFormData) => ({
      ...prev,
      [id]: value,
    }));
  };

  // handling submit by sending the formdata to the parent
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };
    onUpdate(updatedData); // send data to parent or API
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded-full p-1 transition-colors duration-150"
          aria-label="Close">
          {/* Heroicons X-mark SVG icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <form onSubmit={handleSubmit}>
          {/* Title Input Group */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-semibold mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 ease-in-out"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* URL Input Group */}
          <div className="mb-4">
            <label
              htmlFor="url"
              className="block text-gray-700 text-sm font-semibold mb-1">
              URL
            </label>
            <input
              id="url"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 ease-in-out"
              value={formData.url}
              onChange={handleChange}
            />
          </div>

          {/* Tags Input Group */}
          <div className="mb-6">
            <label
              htmlFor="tags"
              className="block text-gray-700 text-sm font-semibold mb-1">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 ease-in-out"
              value={formData.tags}
              onChange={handleChange}
              placeholder="comma separated tags"
            />
          </div>

          {/* Note Input Group */}
          <div className="mb-4">
            <label
              htmlFor="note"
              className="block text-gray-700 text-sm font-semibold mb-1">
              Note
            </label>
            <textarea
              id="note"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 ease-in-out"
              value={formData.note}
              onChange={handleChange}
            />
          </div>

          {/* Update Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
