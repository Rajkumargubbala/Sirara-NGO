"use client";

import dynamic from "next/dynamic";
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
  label?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
];

export default function RichTextEditor({ value, onChange, label }: EditorProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="bg-white rounded-md border border-gray-300 overflow-hidden">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          className="min-h-[200px]"
        />
      </div>
    </div>
  );
}
