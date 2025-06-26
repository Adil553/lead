import { Input } from "../ui/input";
import { Search, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import clsx from "clsx";

type SearchBarProps = {
  onSearch: (query: string) => void;
  placeholder: string;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  disabled?: boolean;
  isLoading?: boolean; // 👈 Optional loading state
  loadingText?: string;
};

export const SearchBar = ({
  onSearch,
  placeholder,
  className,
  inputClassName,
  iconClassName,
  disabled,
  isLoading = false,
  loadingText,
}: SearchBarProps) => {
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 1000);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className={clsx("relative w-full", className)}>
      <Search
        className={clsx(
          "absolute left-3 top-1.5 w-4 text-muted-foreground",
          iconClassName
        )}
      />
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={clsx("pl-10 pr-20 text-lg", inputClassName)} // 👈 extra padding for loading text
        disabled={disabled}
      />
      {isLoading && (
        <div className="absolute right-3 top-2 flex items-center gap-1 text-xs text-muted-foreground">
          {loadingText && <span>{loadingText}</span>}
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
      )}
      {query && !disabled && !isLoading && (
        <X
          className="absolute right-3 top-2 h-4 w-4 text-muted-foreground cursor-pointer"
          onClick={handleClear}
        />
      )}
    </div>
  );
};
