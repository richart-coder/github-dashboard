import React, { forwardRef, memo } from "react";

type OverlayModalProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

const OverlayModal = forwardRef<HTMLDialogElement, OverlayModalProps>(
  (
    { title, onClose, children }: OverlayModalProps,
    ref: React.Ref<HTMLDialogElement>
  ) => (
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
        className="bg-white rounded-lg shadow-lg w-4xl  h-[80vh] min-h-[200px] flex flex-col relative p-4"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="w-fit text-gray-500 hover:text-gray-700 hover:cursor-pointer ml-auto"
          aria-label="關閉對話框"
        >
          x
        </button>
        <div className="flex-1 overflow-y-auto scrollbar-hide p-12">
          <h2 id="modal-title" className="text-lg font-bold mb-4">
            {title}
          </h2>
          <div id="modal-description" className="w-full h-full p-4">
            {children}
          </div>
        </div>
      </div>
    </dialog>
  )
);
OverlayModal.displayName = "OverlayModal";
export default memo(OverlayModal);
