import { faContactBook, faHome, faInfoCircle, faRuler, faSearch, faShirt, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "../../styles/Header/Header.css"
import "../../styles/Header/Nav.css"
import { useEffect, useState } from "react"
import { BsShare } from "react-icons/bs";
import { Link, useNavigate } from "react-router"
import { AutoComplete } from "../Search/AutoComplete"
import type { Product } from "../../models/Types/Search/Product"
import { apiFetcher } from "../../services/ApiFetcher"
import { products } from "../../models/objects/products"

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    
  
const navList = [
    {
      id: 1,
      icon: <FontAwesomeIcon icon={faHome} />,
      title: "Home",
      path: "/",

    },
    {
      icon: <FontAwesomeIcon icon={faShirt}/>,
      title: "Products",
      path: "/Products",
    },
    {
      icon: <FontAwesomeIcon icon={faRuler}/>,
      title: "Size Calculator",
      path: "/Size_Calculator",

    },
    {
      icon: <FontAwesomeIcon icon={faInfoCircle}/>,
      title: "About",
      path: "/About",
    },
    {
      icon: <FontAwesomeIcon icon={faContactBook}/>,
      title: "Contacts",
      path: "/Contacts",
    },
  ];
  const sideList = [
    {
      icon: <FontAwesomeIcon icon={faHome} />,
      title: "Home",
      path: "/",

    },
    {
      icon: <FontAwesomeIcon icon={faShirt}/>,
      title: "Products",
      path: "/Products",
    },
    {
      icon: <FontAwesomeIcon icon={faRuler}/>,
      title: "Size Calculator",
      path: "/Size_Calculator",

    },
    {
      icon: <FontAwesomeIcon icon={faInfoCircle}/>,
      title: "About",
      path: "/About",
    },
    {
      icon: <FontAwesomeIcon icon={faContactBook}/>,
      title: "Contacts",
      path: "/Contacts",
    },
  ];


  const handleDrawer = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleEscKeyPress = (e: any) => {
      if (e.keyCode === 27 && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.setProperty("overflow", "hidden");
    } else {
      document.body.style.removeProperty("overflow");
    }

    document.addEventListener("keydown", handleEscKeyPress);

    return () => {
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, [isOpen]);

  return (
    <nav className="flex w-full items-center px-6 h-16 bg-white border-b border-gray-200 z-10">
      <section className="flex items-center">
        {/* Mobile */}
        <button className="mr-2 hamburger-icon" aria-label="Open Menu" onClick={handleDrawer}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>        
      </section>

      {/* Desktop */}
      <section className="flex-1">
        <section className="navList hidden md:flex md:bg-transparent ">
          {navList.map(({ icon, title, path }, index) => {
            return (
              <li
                key={index}
                title="Wishlist"
                className="listItem flex items-center p-3 font-medium mr-2 text-center rounded focus:outline-none focus:bg-gray-400"
              >
              <Link to={path}>
                <span>{icon}</span>
                <span className="title">{title}</span>
              </Link>
              </li>
            );
          })}
        </section>
      </section>
      
      {/* Sökruta */}
      <section className="ml-4 flex items-center gap-3">
        <section className="nav-search-container">
       <AutoComplete<Product> 
        value={query} 
        onChange={setQuery} 
        onSelect={(p) => navigate(`/Products/${p.id}`)} 
        getItemLabel={(p) => p.label} getItemLink={(p) => `/Products/${p.id}`} 
        placeholder="Search" 
        minLength={2} 
        debounceMS={250} 
        maxItems={8} 
        fetchSuggestions={apiFetcher} 
        multiple={products}
        className="w-60 md:w-80 shrink-8"/>             
          <Link to={`search?q=${encodeURIComponent(query)}`}>
            <FontAwesomeIcon icon={faSearch}/>
          </Link>

        </section>
        
        <section className="icon-container-mobile-static flex items-center gap-2">
          <FontAwesomeIcon icon={faUser}/>

        </section>
        </section>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-20"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          className={`transform top-0 left-0 w-full bg-black fixed h-full overflow-auto 
                      ease-in-out transition-all duration-300 z-30 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
        <header className="headrow">
          <section className="logo">ClearChoice</section>

          {/* Gör close som en knapp och ta bort inset-0 */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="close-icon"   // behåll bara denna klass här
            aria-label="Stäng meny"
          >
            <span className="closebar"></span>
            <span className="closebar"></span>
          </button>
        </header>
        {sideList.map(({ icon, title, path }, index) => {
          return (
            <span
              key={index}
              className="listItem flex items-center p-4 border-b"
            >
              <Link to={path}>
                <span className="mr-2">{icon}</span> 
                <span>{title}</span>
              </Link>
            </span>
          );
        })}
        <div className="fixed bottom-0 w-full">
          <button className="flex items-center p-4 text-white bg-blue-500 w-full">
            <span className="mr-2">
              <BsShare className="text-2xl" />
            </span>

            <span>Share</span>
          </button>
        </div>
      </aside>
    </nav>
  );
};

