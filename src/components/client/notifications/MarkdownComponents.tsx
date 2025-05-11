import React from "react";
import { Components } from "react-markdown";

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const MarkdownComponents: Components = {
  h1: (props) => (
    <h1
      className="mt-6 mb-4 pb-2 text-[24px] leading-tight font-semibold border-b border-gray-200"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-6 mb-4 text-[20px] leading-tight font-semibold"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-5 mb-3 text-[16px] leading-tight font-semibold"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="mt-4 mb-2 text-[14px] leading-tight font-semibold"
      {...props}
    />
  ),
  h5: (props) => (
    <h5
      className="mt-3 mb-1 text-[12px] leading-tight font-semibold"
      {...props}
    />
  ),
  h6: (props) => (
    <h6
      className="mt-3 mb-1 text-[12px] leading-tight font-semibold text-gray-600"
      {...props}
    />
  ),

  p: (props) => <p className="mb-4 leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold" {...props} />,
  em: (props) => <em className="italic" {...props} />,

  ul: (props) => <ul className="mb-4 pl-8 list-disc" {...props} />,
  ol: (props) => <ol className="mb-4 pl-8 list-decimal" {...props} />,
  li: (props) => <li className="mb-1" {...props} />,

  blockquote: (props) => (
    <blockquote
      className="mb-4 pl-4 border-l-4 border-gray-200 text-gray-600"
      {...props}
    />
  ),

  a: (props) => (
    <a
      className="text-blue-600 hover:text-blue-800 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),

  img: (props) => (
    <img
      className="max-w-full h-auto my-4 rounded-md border border-gray-200"
      {...props}
    />
  ),

  code: ({ inline, className, children, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || "");

    return !inline && match ? (
      <div className="mb-4 rounded-md border border-gray-200 overflow-hidden">
        <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs font-medium text-gray-600">
          {match[1].toUpperCase()}
        </div>
        <pre className="p-4 overflow-auto bg-gray-50 text-sm">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    ) : (
      <code
        className="px-1.5 py-0.5 mx-0.5 rounded-md bg-gray-100 text-sm font-mono text-red-600"
        {...props}
      >
        {children}
      </code>
    );
  },

  pre: (props) => <pre className="overflow-auto" {...props} />,

  table: (props) => (
    <div className="mb-6 overflow-x-auto">
      <table className="min-w-full border border-gray-200" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-gray-50" {...props} />,
  tbody: (props) => <tbody className="divide-y divide-gray-200" {...props} />,
  tr: (props) => <tr className="hover:bg-gray-50" {...props} />,
  th: (props) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
      {...props}
    />
  ),
  td: (props) => (
    <td className="px-6 py-4 text-sm border-b border-gray-200" {...props} />
  ),

  hr: (props) => <hr className="my-6 border-t border-gray-200" {...props} />,

  del: (props) => <del className="line-through text-gray-500" {...props} />,

  input: (props) => {
    if (props.type === "checkbox") {
      return (
        <input
          type="checkbox"
          className="mr-1 h-4 w-4 rounded border-gray-300"
          readOnly
          {...props}
        />
      );
    }
    return <input {...props} />;
  },
};
