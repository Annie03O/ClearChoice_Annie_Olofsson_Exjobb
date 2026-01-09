import { faAngleDown, faAngleUp, faArrowDown, faArrowUp, faContactBook, faEnvelope, faHome, faInfoCircle, faLocation, faLocationPin, faLocationPinLock, faPhone, faRuler, faShirt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

export const Footer = () => {
  const [showShop, setShowShop] =  useState(false);
  const [showContact, setShowContact] =  useState(false);
  const [showAbout, setShowAbout] =  useState(false);
  const [showJoin, setShowJoin] =  useState(false);

  const nav = useNavigate();
      const navList = [
    {
      id: 1,
      icon: <FontAwesomeIcon icon={faHome} />,
      title: "Home",
      path: "/",
    },
    {
      icon: <FontAwesomeIcon icon={faShirt} />,
      title: "Products",
      path: "/Products",
    },
    {
      icon: <FontAwesomeIcon icon={faRuler} />,
      title: "Size Calculator",
      path: "/Size_Calculator",
    },
  ];

    return (
<footer className="text-[#010057] bg-white">
  {/* Desktop */}
  <section className="hidden md:grid md:grid-cols-2 md:grid-flow-row-dense lg:grid-flow-row lg:grid-cols-9 w-full ">
    <section className="col-start-1 p-1 w-full">
      <ul className="flex-col gap-1 pt-1 pb-1 ml-2">
        <li className="font-bold">Shop</li>
        {navList.map((i) => (
          <li key={i.path}>
            <Link to={i.path}>{i.title}</Link>
          </li>
        ))}
      </ul>
    </section>

    <section className="col-start-1 lg:col-start-3  p-1">
      <ul className="flex flex-col gap-1 pt-1 pb-1 ml-2">
        <li className="font-bold">Contact</li>
        <li className="flex items-center text-[1em] gap-1"><FontAwesomeIcon className="text-[#010057 text-[.9em]" icon={faEnvelope}/> support@clearchoice.com</li>
        <li className="flex text-[1em] gap-1"><FontAwesomeIcon className="text-[#010057] text-[.9em]" icon={faPhone}/> 123 456 78</li>
        <li className="flex text-[1em] gap-1"><FontAwesomeIcon className="text-[#010057] text-[.9em]" icon={faLocationPin}/> Adressvägen 1, 123 45, Stockholm</li>
      </ul>
    </section>

    <section className="col-start-2 lg:col-start-5 col-span-3">
      <ul className="flex flex-col gap-1 pt-1 pb-1 ml-2">
        <li className="font-bold">About ClearChoice</li>
          <li>ClearChoice is dedicated to providing the best online shopping experience for clothing. Our mission is to help you find the perfect fit with ease and confidence.</li>
      </ul>
    </section>

    <section className="lg:col-start-8 col-span-2">
      <ul className="flex flex-col gap-1 pt-1 pb-1 ml-2">
        <li className="font-bold">Join now</li>
        <li>Become a member today and get exclusive benefits!</li>
        <li><button className="underline" onClick={() => nav("/Register")}>Create an account</button></li>
      </ul>
    </section>
  </section>
  
  {/* Mobile */}
  <section className="md:hidden flex flex-col ">
    <section className=" w-full">
      {showShop === false ? <button onClick={() => setShowShop(true)} className="text-3xl border text-left w-full">
        <span className="w-[90%] pl-2">Shop</span> 
        <FontAwesomeIcon className="text-[#010057]" icon={faAngleDown}/>
      </button> : <button onClick={() => setShowShop(false)} className="text-3xl border text-left w-full">
        <span className="w-[90%] pl-2">Shop</span>
        <FontAwesomeIcon className="text-[#010057]" icon={faAngleUp}/>
      </button>}
      <ul className={`${showShop === false ? "hidden" : "flex-col gap-1 pt-1 pb-1 ml-2 pl-4"} `}>
                {navList.map((i) => (
          <li key={i.path}>
            <Link to={i.path}>{i.title}</Link>
          </li>
        ))}
      </ul>
    </section>

    <section className="col-start-3">
      {showContact === false ? <button onClick={() => setShowContact(true)} className="text-3xl border text-left w-full">
      
        <span className="w-[90%] pl-2">Contact</span> 
        <FontAwesomeIcon className="text-[#010057]" icon={faAngleDown}/>
      </button> : <button onClick={() => setShowContact(false)} className="text-3xl border text-left w-full">
        <span className="w-[90%] pl-2">Contact</span>
        <FontAwesomeIcon className="text-[#010057]" icon={faAngleUp}/>
      </button>}
      
      <ul className={`${showContact === false ? "hidden" : "flex-col gap-1 pt-1 pb-1 pl-6"} `}>
        <li><FontAwesomeIcon className="text-[#010057]" icon={faEnvelope}/> support@clearchoice.com</li>
        <li><FontAwesomeIcon className="text-[#010057]" icon={faPhone}/> 123 456 78</li>
        <li><FontAwesomeIcon className="text-[#010057]" icon={faLocationPin}/> Adressvägen 1, 123 45, Stockholm</li>
      </ul>
    </section>

    <section className="col-start-5 col-span-3">
      {showAbout === false ? <button onClick={() => setShowAbout(true)} className="text-3xl border text-left w-full">
        <span className="w-[90%] pl-2">About ClearChoice</span> 
        <FontAwesomeIcon className="text-[#010057]" icon={faAngleDown}/>
      </button> : <button onClick={() => setShowAbout(false)} className="text-3xl border text-left w-full">
        <span className="w-[90%] pl-2">About ClearChoice</span> 
        <FontAwesomeIcon className="text-[#010057]" icon={faAngleUp}/>
      </button> }
      <ul className={`${showAbout === false ? "hidden" :"flex flex-col gap-1 pt-1 pb-1 pl-6"}`}>
          <li>ClearChoice is dedicated to providing the best online shopping experience for clothing. Our mission is to help you find the perfect fit with ease and confidence.</li>
      </ul>
    </section>

    <section className="col-start-8 col-span-2">
      {showJoin === false ? <button onClick={() => setShowJoin(true)} className="text-3xl border text-left w-full">
        <span className="w-[90%] pl-2">Join Now</span> 
        <FontAwesomeIcon className="text-[#010057]" icon={faAngleDown}/>
        </button> : <button onClick={() => setShowJoin(false)} className="text-3xl border text-left w-full">
        <span className="w-[90%] pl-2">Join Now</span>
        <FontAwesomeIcon className="text-[#010057]" icon={faAngleUp}/>
        </button> }
        
        <ul className={`${showJoin === false ? "hidden" :"flex flex-col gap-1 pt-1 pb-1 pl-6"}`}>
        <li>Become a member today and get exclusive benefits!</li>
        <li><button className="underline" onClick={() => nav("/Register")}>Create an account</button></li>
      </ul>
    </section>
  </section>
</footer>
    )
}