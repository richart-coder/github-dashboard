import React from "react";

export const MarkdownComponents = {
  h1: ({ ...props }) => (
    <h1 className="text-2xl font-bold border-b pb-2 mb-4" {...props} />
  ),
  h2: ({ ...props }) => (
    <h2 className="mt-8 mb-4 text-xl font-bold" {...props} />
  ),
  h3: ({ ...props }) => (
    <h3 className="mt-6 mb-3 text-lg font-semibold" {...props} />
  ),
  p: ({ ...props }) => <p className="mb-3" {...props} />,

  a: ({ ...props }: any) => (
    <a
      className="text-blue-600 underline hover:text-blue-800"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ol: ({ ...props }) => <ul className="mb-4 list-disc ml-6" {...props} />,
  ul: ({ ...props }) => <ul className="mb-4 list-disc ml-6" {...props} />,
  li: ({ ...props }) => <li className="mb-1.5" {...props} />,
  code: ({ ...props }: any) => (
    <code className="bg-gray-100 px-1 rounded" {...props} />
  ),
  hr: ({ ...props }) => (
    <hr className="my-6 border-t border-gray-300" {...props} />
  ),
};
