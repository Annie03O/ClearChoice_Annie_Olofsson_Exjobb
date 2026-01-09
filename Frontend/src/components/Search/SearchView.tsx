import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { AutoCompleteProps } from "../../models/Types/Search/BaseProps";
import { useDebounceValue } from "../../hooks/useDebouncedValue";
import { AutoComplete } from "./AutoComplete";
import type { Product } from "../../models/Types/Search/Product";
import { products } from "../../models/objects/products";
import { apiFetcher } from "../../services/ApiFetcher";


export  function SearchView<T>(props:AutoCompleteProps<T>)  { 
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    

    const handleMenuDrawer = () => setOpen((v) => !v);

    useEffect(() => {
      const handleEscKeyPress = (e: KeyboardEvent) => {
        if (e.key === "Escape" && open) setOpen(false);
      };

      if (open) document.body.style.setProperty("overflow", "hidden");
      else document.body.style.removeProperty("overflow");

      document.addEventListener("keydown", handleEscKeyPress);
      return () => document.removeEventListener("keydown", handleEscKeyPress);
    }, [open]);
    
    return (
        <section className="block md:hidden">
            <button
              className="relative top-[2px] flex flex-col gap-1 "
              aria-label="Open Menu"
              onClick={handleMenuDrawer}
            >

              <FontAwesomeIcon icon={faSearch} className="hover:text-gray-400" />
           </button>       
           <section
              className={`p-2 fixed top-0 right-0 h-dvh w-full sm:w-[90vw] md:max-w-[420px] bg-white text-[#010057] border 
              overflow-y-auto overflow-x-hidden
              transition-transform duration-300 z-30
              ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                <header className="headrow flex flex-col">
                    <section>
                      <section className="logo">ClearChoice</section>
                      {/* Gör close som en knapp och ta bort inset-0 */}
                      <button
                        type="button"
                        className="absolute justify-center align-center top-[20px] right-[20px]"
                        onClick={() => setOpen(false)}
                        aria-label="Stäng meny"
                      >
                        <span className="absolute w-6 h-[2px] bg-[#010057] origin-center rounded-[1px] rotate-45"></span>
                        <span className="bg-[#010057] w-[24px] h-[2px] absolute tranform-center -rotate-45"></span>
                      </button>
                    </section>
                    <section className="flex gap-[14em]">
                       <h2 className="text-3xl">Search</h2>
                    </section>
                </header>
                         <section className="flex"> 
                          <AutoComplete<Product>
                            value={query}
                            onChange={setQuery}
                            onSelect={() => {}}
                            getItemLabel={(p) => p.label}
                            getItemLink={(p) => `/Products/${p.id}`}
                            placeholder="Search"
                            minLength={2}
                            debounceMS={250}
                            maxItems={8}
                            fetchSuggestions={apiFetcher}
                            multiple={products}
                            container
                            setContainer={setOpen}
                          />
                          <Link
                            to={`search?q=${encodeURIComponent(query)}`}
                            className="relative "
                            aria-label="Search"
                          >
                            <FontAwesomeIcon icon={faSearch} className="hover:text-gray-400" />
                          </Link>
                          </section>
                
        </section>
        </section>
    )
}