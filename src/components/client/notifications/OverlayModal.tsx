import React, { forwardRef } from "react";

type OverlayModalProps = {
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
};

const OverlayModal = forwardRef<HTMLDialogElement, OverlayModalProps>(
  ({ title, children, onClose }, ref) => (
    <dialog
      ref={ref}
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby="modal-description"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        className="scrollbar-hide bg-white rounded-lg shadow-lg w-2xl h-[80vh] min-h-[200px] flex flex-col overflow-y-auto p-6 relative"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="w-fit sticky top-0 text-gray-500 hover:text-gray-700 hover:cursor-pointer ml-auto"
          aria-label="關閉對話框"
        >
          x
        </button>
        {title && (
          <h2 id="modal-title" className="text-lg font-bold mb-4">
            {title}
          </h2>
        )}
        <div id="modal-description" className="w-full h-full p-4">
          {children}
        </div>
      </div>
    </dialog>
  )
);

export default OverlayModal;
