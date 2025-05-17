import React from "react";
export function Button({
  onClick,
  className,
  children,
  ...props
}: {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button className={className} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
export const MemoizedButton = React.memo(Button);
