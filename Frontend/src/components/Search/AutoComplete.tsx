import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useDebounceValue } from "../../hooks/useDebouncedValue";
import type { AutoCompleteProps } from "../../models/Types/Search/BaseProps";
import { useNavigate } from "react-router-dom";

export function AutoComplete<T>(props: AutoCompleteProps<T>) {
  const {
    value,
    onChange,
    onSelect,
    getItemLabel,
    getItemLink = () => undefined,
    placeholder = "Search..",
    minLength = 1,
    debounceMS = 250,
    maxItems = 8,
    multiple,
    links,
    fetchSuggestions,
    className,
    container,
    setContainer,
  } = props;

  const inputId = useId();
  const listBoxId = useId();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const containerRef = useRef<HTMLsectionElement | null>(null);

  // Hindrar att listan öppnar igen direkt efter att man valt ett item
  const suppressOpenRef = useRef(false);

  const debouncedQuery = useDebounceValue(value, debounceMS);

  const closeList = () => {
    suppressOpenRef.current = true;
    setOpen(false);
    setHighlighted(-1);
  };

  // Stäng vid klick utanför
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlighted(-1);
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  // Hämta/filtera items
  useEffect(() => {
    const q = (debouncedQuery ?? "").trim();

    if (q.length < minLength) {
      setItems([]);
      setOpen(false);
      setHighlighted(-1);
      setLoading(false);
      setError(null);
      return;
    }

    // Om vi precis valde ett item: öppna inte igen på nästa effect-körning
    if (suppressOpenRef.current) {
      suppressOpenRef.current = false;
      return;
    }

    // FETCH
    if (typeof fetchSuggestions === "function") {
      const ac = new AbortController();

      (async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await fetchSuggestions(q, ac.signal);
          const sliced = response.slice(0, maxItems);

          setItems(sliced);
          setOpen(sliced.length > 0);
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

    // LOCAL LIST: multiple
    if (Array.isArray(multiple)) {
      const filtered = multiple.filter((it) =>
        getItemLabel(it).toLowerCase().includes(q.toLowerCase())
      );
      const sliced = filtered.slice(0, maxItems);

      setItems(sliced);
      setOpen(sliced.length > 0);
      setError(null);
      setLoading(false);
      return;
    }

    // LOCAL LIST: links
    if (Array.isArray(links)) {
      const filtered = links.filter((l) =>
        (getItemLink(l as unknown as T) ?? "")
          .toLowerCase()
          .includes(q.toLowerCase())
      );
      const sliced = filtered.slice(0, maxItems) as unknown as T[];

      setItems(sliced);
      setOpen(sliced.length > 0);
      setError(null);
      setLoading(false);
      return;
    }
  }, [
    debouncedQuery,
    fetchSuggestions,
    maxItems,
    minLength,
    getItemLabel,
    getItemLink,
    multiple,
    links,
  ]);

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
          const item = items[highlighted];
          const href = getItemLink(item);

          closeList();
          setContainer?.(false);
          onSelect(item);
          if (href) navigate(href);
        }
        break;
      case "Escape":
        setOpen(false);
        setHighlighted(-1);
        break;
    }
  };

  const styles = useMemo(
    () => ({
      container: "relative inline-block w-full",
      input:
        "md:w-[clamp(100px,20vw,450px)] w-full rounded-lg border px-[clamp(15px,1.1vw,30px)] py-[clamp(5px,.5vw,30px)] outline-none focus:ring text-black text-[clamp(12px,1.1vw,30px)]",
      panel:
        "absolute z-50 mt-1 w-full rounded-lg border bg-white shadow-lg overflow-auto max-h-64",
      panelInline:
        "relative z-50 mt-1 w-full rounded-lg border bg-white shadow-lg overflow-auto max-h-64",
      row: "px-3 py-2 cursor-pointer text-[clamp(12px,1.1vw,30px)]",
      rowActive: "px-3 py-2 cursor-pointer bg-gray-100",
      empty: "px-3 py-2 text-sm text-gray-500",
      loading: "px-3 py-2 text-sm text-gray-500 italic",
      error: "px-3 py-2 text-sm text-red-600",
    }),
    []
  );

  const activeId =
    highlighted >= 0 ? `${listBoxId}-opt-${highlighted}` : undefined;

  const panelClass = container ? styles.panelInline : styles.panel;

  return (
    <section
      ref={containerRef}
      className={styles.container + (className ? ` ${className}` : "")}
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
          className={panelClass}
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
              const href = getItemLink(item);
              const isActive = idx === highlighted;

              return (
                <li
                  key={idx}
                  id={`${listBoxId}-opt-${idx}`}
                  role="option"
                  aria-selected={isActive}
                  onMouseEnter={() => setHighlighted(idx)}
                  className="p-1"
                >
                  <button
                    type="button"

                    className={isActive ? styles.rowActive : styles.row}
                    // Behåll fokus (så outside-click inte triggar konstigt)
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      closeList();
                      setContainer?.(false);
                      onSelect(item);
                      if (href) navigate(href);
                    }}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
        </ul>
      )}
    </section>
  );
}
