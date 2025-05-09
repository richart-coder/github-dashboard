import { useRef, useCallback } from "react";

export default function useDialogControl(): [
  React.RefObject<HTMLDialogElement | null>,
  () => void,
  () => void
] {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  }, []);

  return [dialogRef, open, close];
}
