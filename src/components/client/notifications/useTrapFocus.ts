import { useLayoutEffect, useRef } from "react";

export default function useFocusTrap(isOpen: boolean) {
  const modalRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement;

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableSelector =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusableElements = Array.from(
        modalRef.current?.querySelectorAll(focusableSelector) || []
      ).filter(
        (el) =>
          !el.hasAttribute("disabled") &&
          getComputedStyle(el as HTMLElement).display !== "none"
      ) as HTMLElement[];

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const focusIsInModal = focusableElements.includes(
        document.activeElement as HTMLElement
      );
      if (!focusIsInModal) {
        e.preventDefault();
        firstElement.focus();
        return;
      }

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    const setInitialFocus = () => {
      const autoFocusElement = modalRef.current?.querySelector(
        "[autoFocus]"
      ) as HTMLElement;

      if (autoFocusElement) {
        autoFocusElement.focus();
        return;
      }

      const focusableSelector =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const firstFocusableElement = modalRef.current?.querySelector(
        focusableSelector
      ) as HTMLElement;

      if (firstFocusableElement) {
        firstFocusableElement.focus();
      } else {
        modalRef.current?.setAttribute("tabindex", "-1");
        modalRef.current?.focus();
      }
    };

    setTimeout(setInitialFocus, 50);

    document.addEventListener("keydown", trapFocus, true);

    return () => {
      document.removeEventListener("keydown", trapFocus, true);
      if (previouslyFocusedElement && previouslyFocusedElement.isConnected) {
        previouslyFocusedElement.focus();
      }
    };
  }, [isOpen, modalRef]);
  return modalRef;
}
