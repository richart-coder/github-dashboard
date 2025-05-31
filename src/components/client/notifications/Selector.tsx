type SelectContainerProps = {
  id: string;
  label: string;
  selectedValue: string;
  onSelect?: (value: string) => void;
  children: React.ReactNode;
};

const Selector = ({
  id,
  label,
  selectedValue = "",
  onSelect,
  children,
}: SelectContainerProps) => {
  return (
    <div className="mb-8">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={selectedValue}
        onChange={(e) => onSelect?.(e.target.value)}
        className="border rounded px-3 py-2 w-full max-w-md"
      >
        {children}
      </select>
    </div>
  );
};

export default Selector;
