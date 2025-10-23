import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useDebounceValue } from "../../hooks/useDebouncedValue";
import type { AutoCompleteProps } from "../../models/Types/Search/BaseProps";
import { Link } from "react-router-dom";
import "../../styles/Search/Autocomplete.css"

export function AutoComplete<T>(props: AutoCompleteProps<T>) {
  const {
    value,
    onChange,
    onSelect,
    getItemLabel,
    getItemLink = () => undefined, // safe default
    placeholder = "Search..",
    minLength = 1,
    debounceMS = 250,
    maxItems = 8,
    multiple,
    links,
    fetchSuggestions,
    className
  } = props;

  const inputId = useId();
  const listBoxId = useId();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  useRef<Map<string, T[]>>(new Map());

  const debouncedQuery = useDebounceValue(value, debounceMS);

  // Stäng vid klick utanför (med korrekt cleanup)
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlighted(-1);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Hämta/filtera items
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length < minLength) {
      setItems([]);
      setOpen(false);
      setHighlighted(-1);
      setLoading(false);
      setError(null);
      return;
    }

    if (typeof fetchSuggestions === "function") {
      const ac = new AbortController();
      (async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await fetchSuggestions(q, ac.signal);
          setItems(response.slice(0, maxItems));
          setOpen(response.length > 0);
        } catch (err: any) {
          if (err?.name !== "AbortError") {
            setError(err?.message ?? "Something went wrong");
            setItems([]);
            setOpen(false);
          }
        } finally {
          setLoading(false);
        }
      })();
      return () => ac.abort();
    }

    if (Array.isArray(multiple)) {
      const filtered = multiple.filter((it) =>
        getItemLabel(it).toLowerCase().includes(q.toLowerCase())
      );
      setItems(filtered.slice(0, maxItems));
      setOpen(filtered.length > 0);
      setError(null);
      setLoading(false);
    }

    if (Array.isArray(links)) {
      const filtered = links.filter((l) =>
        (getItemLink(l as unknown as T) ?? "")
          .toLowerCase()
          .includes(q.toLowerCase())
      );
      setItems(filtered.slice(0, maxItems) as unknown as T[]);
      setOpen(filtered.length > 0);
      setError(null);
      setLoading(false);
    }
  }, [debouncedQuery, fetchSuggestions, maxItems, minLength, getItemLabel, getItemLink, multiple, links]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(items.length > 0);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((h) => (h + 1) % Math.max(items.length, 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted(
          (h) => (h - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1)
        );
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setHighlighted(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setHighlighted(items.length - 1);
        }
        break;
      case "Enter":
        if (open && highlighted >= 0 && items[highlighted]) {
          e.preventDefault();
          selectItem(items[highlighted]);
        }
        break;
      case "Escape":
        setOpen(false);
        setHighlighted(-1);
        break;
    }
  };

  const selectItem = (item: T) => {
    onSelect(item);
    setOpen(false);
    setHighlighted(-1);
  };

  // Rendera labeln med highlight — hela labeln är klickbar länk
  const renderHighlightedLabel = (label: string, href?: string) => {
    const q = (value ?? "").trim();
    if (!href) return <span>{label}</span>;
    if (!q) return <Link to={href}>{label}</Link>;

    const lower = label.toLowerCase();
    const qi = q.toLowerCase();
    const idx = lower.indexOf(qi);
    if (idx === -1) return <Link to={href}>{label}</Link>;

    return (
      <Link to={href} onClick={(e) => e.stopPropagation()}>
        {label.slice(0, idx)}
        <mark>{label.slice(idx, idx + q.length)}</mark>
        {label.slice(idx + q.length)}
      </Link>
    );
  };

  const styles = useMemo(
    () => ({
      container: "relative inline-block w-full",
      input: "w-full rounded-lg border px-3 py-2 outline-none focus:ring",
      panel:
        "absolute z-50 mt-1 w-full rounded-lg border bg-white shadow-lg overflow-auto max-h-64",
      row: "px-3 py-2 cursor-pointer",
      rowActive: "px-3 py-2 cursor-pointer bg-gray-100",
      empty: "px-3 py-2 text-sm text-gray-500",
      loading: "px-3 py-2 text-sm text-gray-500 italic",
      error: "px-3 py-2 text-sm text-red-600",
    }),
    []
  );

  const activeId =
    highlighted >= 0 ? `${listBoxId}-opt-${highlighted}` : undefined;

  return (
    <section
      ref={containerRef}
      className={(styles.container + (className ? `${className}` : ""))}
    >
      <input
        id={inputId}
        className={styles.input}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listBoxId}
        aria-activedescendant={activeId}
        aria-haspopup="listbox"
        autoComplete="off"
      /> 

      {open && (
        <ul
          id={listBoxId}
          role="listbox"
          aria-labelledby={inputId}
          className={styles.panel}
        >
          {loading && <li className={styles.loading}>Loading...</li>}
          {error && <li className={styles.error}>{error}</li>}

          {!loading && !error && items.length === 0 && (
            <li className={styles.empty}>No matches</li>
          )}

          {!loading &&
            !error &&
            items.map((item, idx) => {
              const label = getItemLabel(item);
              const href = getItemLink(item); // måste returnera t.ex. "/products/ID"
              const isActive = idx === highlighted;

              return (
                <li
                  id={`${listBoxId}-opt-${idx}`}
                  role="option"
                  aria-selected={isActive}
                  key={idx}
                  onMouseEnter={() => setHighlighted(idx)}
                  // viktig: blockera inte länkklick
                  onClick={() => selectItem(item)}
                >
                  {renderHighlightedLabel(label, href)}
                </li>
              );
            })}
        </ul>
      )}
    </section>
  );
}
