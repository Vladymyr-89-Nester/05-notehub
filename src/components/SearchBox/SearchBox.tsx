import type { ChangeEvent } from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  query: string;
  onChange: (query: string) => void;
}

export default function SearchBox({ query, onChange }: SearchBoxProps) {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    onChange(value);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={query}
      onChange={handleOnChange}
    />
  );
}
