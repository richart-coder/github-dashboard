import React, { forwardRef } from "react";

type OverlayModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

const OverlayModal = forwardRef(
  (
    { open, onClose, title, children }: OverlayModalProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    if (!open) return null;
    return (
      <div
        ref={ref}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/10"
        onClick={onClose}
      >
        <div
          className="scrollbar-hide bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] min-h-[200px] min-w-[300px] flex flex-col overflow-y-auto p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="w-fit sticky top-0 text-gray-500 hover:text-gray-700 hover:cursor-pointer ml-auto"
          >
            x
          </button>
          {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
          <div className="flex-1 flex flex-col">{children}</div>
        </div>
      </div>
    );
  }
);

export default OverlayModal;
