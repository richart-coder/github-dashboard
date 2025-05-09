import { useRef, useCallback } from "react";

export default function useDialogControl(): [
  React.RefObject<HTMLDialogElement>,
  () => void,
  () => void
] {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog && dialog.open) dialog.close();
  }, []);

  return [dialogRef as React.RefObject<HTMLDialogElement>, open, close];
}
