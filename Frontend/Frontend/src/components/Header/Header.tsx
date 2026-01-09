import {
  faHome,
  faRuler,
  faSearch,
  faShirt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { BsShare } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router";
import { AutoComplete } from "../Search/AutoComplete";
import type { Product } from "../../models/Types/Search/Product";
import { apiFetcher } from "../../services/ApiFetcher";
import { products } from "../../models/objects/products";
import { CartView } from "../Cart/CartView";
import { SavedView } from "../Saved/SavedView";
import { useUserAuth } from "../../hooks/Auth/useUserAuth";
import { Modal } from "../ul/Modal";
import { Login } from "../../pages/Nav/Auth/Login";
import { SearchView } from "../Search/SearchView";
import { BreadCrumbs } from "./BreadCrumbs";

export const Header = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useUserAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();

  const navList = [
    {
      icon: <FontAwesomeIcon className="text-[clamp(15px,1.1vw,30px)]" icon={faHome} />, 
      title: "Home",
      path: "/",
    },
    {
      icon: <FontAwesomeIcon className="text-[clamp(15px,1.1vw,30px)]" icon={faShirt} />,
      title: "Products",
      path: "/Products",
    },
    {
      icon: <FontAwesomeIcon className="text-[clamp(15px,1.1vw,30px)]" icon={faRuler} />,
      title: "Size Calculator",
      path: "/Size_Calculator",
    },
  ];

  const sideList = [
    { 
      icon: <FontAwesomeIcon className="text-[clamp(15px,1.1vw,30px)]" icon={faHome} />, 
      title: "Home", 
      path: "/" 
    },
    { 
      icon: <FontAwesomeIcon className="text-[clamp(15px,1.1vw,30px)]" icon={faShirt} />,
      title: "Products", 
      path: "/Products" 
    },
    { 
      icon: <FontAwesomeIcon className="text-[clamp(15px,1.1vw,30px)]" icon={faRuler} />,
      title: "Size Calculator", 
      path: "/Size_Calculator" 
    },
   ];

  const handleMenuDrawer = () => setIsOpenMenu((v) => !v);

  useEffect(() => {
    const handleEscKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpenMenu) setIsOpenMenu(false);
    };

    if (isOpenMenu) document.body.style.setProperty("overflow", "hidden");
    else document.body.style.removeProperty("overflow");

    document.addEventListener("keydown", handleEscKeyPress);
    return () => document.removeEventListener("keydown", handleEscKeyPress);
  }, [isOpenMenu]);

  const goToDashboard = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    navigate("/dashboard")
  }

  const navToPage = (path: string) => {
    navigate(path, {
      state: {
        canGoBack: true
      }
    })

    if (isOpenMenu === true) {
      setIsOpenMenu(false)
    }
  }
  return (
    <nav className="flex  flex-col items-center justify-center">
    <section className="flex bg-white items-center justify-center max-w-[1400px]:px-6 h-[70px] border-b border-gray-200 z-10 font-serif text-[#010057] text-[1.2em] w-full h-[clamp(40px,3.25vw,90px)]">
      <section className=" flex lg:w-full w-[96%] gap-4 justify-center ">
      {/* Left: burger */}
      <section className="flex  justify-center items-center w-[5%] md:hidden ">
        <button
          className="relative top-[2px] flex flex-col gap-1 "
          aria-label="Open Menu"
          onClick={handleMenuDrawer}
        >
          <span className=" block bg-[#010057] h-[2px] w-[20px]" />
          <span className=" block bg-[#010057] h-[2px] w-[20px] " />
          <span className=" block bg-[#010057] h-[2px] w-[20px]" />
        </button>
      </section>

      {/* Center: Desktop nav */}
      <section className=" flex w-[70%] gap-[clamp(20px, 1,9vw, 40px)]">
       <span className="text-[clamp(20px,2vw,56px)] flex items-center justify-center md:w-[20%] ">
            ClearChoice 
          </span>
        <ul className="hidden md:flex items-center justify-center w-fit gap-[clamp(20px, 1,9vw, 40px)">
          {navList.map(({ icon, title, path }, index) => (
            <li
              key={index}
              className="flex items-center p-2 min-w-[1400px]:p-3 font-medium text-center focus:outline-none focus:bg-gray-400 max-[1040px]:ml-0 hover:text-gray-400 "
            >
              <button className="flex justify-center items-center" type="submit" onClick={() => navToPage(path)}>
                <span className="text-[clamp(15px,1.1vw,30px)]">{icon}</span>
                <span className="text-[clamp(15px,1.1vw,30px)] whitespace-nowrap">{title}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Right: Search + user + saved + cart */}
      <section className="flex items-center gap-3 ">
        {/* Search row (input hidden <=1285px) */}
        <section className="hidden md:flex items-center gap-[clamp(3px,.55vw,30px)]">
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
            container={false}
          />
          <Link
            to={`search?q=${encodeURIComponent(query)}`}
            className="relative "
            aria-label="Search"
          >
            <FontAwesomeIcon icon={faSearch} className="hover:text-gray-400 text-[clamp(18px,1vw,30px)]" />
          </Link>
        </section>
        <SearchView       
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
          container={true}
          />

       <section className="flex items-center gap-1 ">
          
        {/* User */}
          <button onClick={goToDashboard}>
             <FontAwesomeIcon icon={faUser} className="hover:text-gray-400"/> 
          </button>
        {/* AUTH MODAL */}
          <Modal
            open={showAuthModal}
            onClose={() => {
              setShowAuthModal(false);
            }}
            title="Not logged in"
            >
                <Login 
                  onClose={() => {
                    setShowAuthModal(false);
                  }
                }
                lastVisited={location.pathname }
                />
           </Modal>
           {/* Saved + cart */}
          <CartView />
          <SavedView />
        </section>
      </section>
    
      </section>
      {/* Drawer */}
      <aside
        className={`bg-[#010057]  fixed top-0 left-0 w-full h-full overflow
            -auto z-30 transform transition-all duration-300 ease-in-out ${
          isOpenMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <header className="relative p-4">
          <section className="whitespace-nowrap text-white text-[2.5em] font-serif">
            ClearChoice
          </section>

          {/* Close button (Tailwind X) */}
          <button
            type="button"
            onClick={() => setIsOpenMenu(false)}
            aria-label="Stäng meny"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center cursor-pointer"
          >
            <span className="absolute w-6 h-[2px] bg-white rounded rotate-45" />
            <span className="absolute w-6 h-[2px] bg-white rounded -rotate-45" />
          </button>
        </header>

        {/* Drawer links */}
        <nav className="text-white">
          {sideList.map(({ icon, title, path }, index) => (
            <section key={index} className="border-b border-white/10">
              <button type="submit" onClick={() => navToPage(path)}>
                <span className="text-[1.2rem] text-white">{icon}</span>
                <span>{title}</span>
              </button>
            </section>
          ))}
        </nav>

        {/* Drawer footer */}
        <section className="fixed bottom-0 w-full">
          <button className="flex items-center gap-2 p-4 text-[#010057] bg-blue-500 w-full">
            <BsShare className="text-2xl" />
            <span>Share</span>
          </button>
        </section>
      </aside>
    
     </section>
     <BreadCrumbs lastVisited={location.pathname }/>
    </nav>
  );
};
