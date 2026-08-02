import { useEffect, useState } from "react";

function SearchInput({ placeholder = "Search...", onSearch, delay = 400 }) {
    const [value, setValue] = useState("");

    useEffect(() => {
        const handle = setTimeout(() => onSearch(value), delay);
        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <input
            type="search"
            className="search-input"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label={placeholder}
        />
    );
}

export default SearchInput;
