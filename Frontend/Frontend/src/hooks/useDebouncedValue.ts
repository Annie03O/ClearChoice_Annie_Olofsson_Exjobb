import { useEffect, useState } from "react";

export const useDebounceValue = <T>(value: T, delay = 250) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);

        return () => clearInterval(id);
    }, [value, delay]);
    return debounced;
}