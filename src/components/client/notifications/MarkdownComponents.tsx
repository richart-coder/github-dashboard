import React from "react";

export const MarkdownComponents = {
  h1: ({ ...props }: any) => (
    <h1 className="text-2xl font-bold border-b pb-2 mb-4" {...props} />
  ),
  h2: ({ ...props }: any) => (
    <h2 className="text-xl font-semibold mt-6 mb-2" {...props} />
  ),
  a: ({ ...props }: any) => (
    <a
      className="text-blue-600 underline hover:text-blue-800"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: ({ ...props }: any) => <ul className="list-disc ml-6" {...props} />,
  code: ({ ...props }: any) => (
    <code className="bg-gray-100 px-1 rounded" {...props} />
  ),
};
