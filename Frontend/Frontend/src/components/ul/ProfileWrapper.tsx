import { faArrowLeft, faPen, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "./Button";
import { Link, useNavigate } from "react-router";

type ProfileWrapperProps = {
    details?: boolean;
    title: "Profile" | "Personal Info" | "My Messurements" | "Order History" | "Order Details";
    children: React.ReactNode;
    isEditing?: boolean;
    setIsEditing?: Dispatch<SetStateAction<Boolean>> | (Dispatch<SetStateAction<boolean>>)
    handleSubmit?: () => void;
    canEdit: boolean;
}
export const ProfileWrapper: React.FC<ProfileWrapperProps> = ({title, children, details, isEditing, setIsEditing, handleSubmit, canEdit}) => {
  const navigate = useNavigate();
  return (
         <section className="bg-white text-[#010057] md:w-[80%] h-[fit-content] md:max-h-50 p-6 md:rounded mx-auto mt-20 flex flex-col gap-5">
            <section className="flex flex-col mt-auto pt-2 absoulute l-1 max-[1800px]:text-[clamp(12px,1.5vw,20px)] min-[1800px]:text-[clamp(20px,1.5vw,27px)]">
              {details ? 
                <button onClick={() => navigate("/dashboard")} className=" hover:text-gray-400 w-[fit-content]">
                  <FontAwesomeIcon icon={faArrowLeft}/> Back 
                </button> 
                : ""
                }
               <section className="max-[1800px]:text-[clamp(12px,1.5vw,20px)] min-[1800px]:text-[clamp(20px,1.5vw,30px)]">
                <Link className="hover:text-gray-400" to="/dashboard">Profile</Link>
                  {details && title === "Order Details" ? "" :  details ? " / " + title : ""}
                  {title === "Order Details" ? " / " +  "Order History" + " / " + title : ""}
              </section>
            </section>
            <section className="flex flex-col justify-center items-center md:gap-1 gap-6 ">
              <header className="flex gap-2 relative md:top-0 top-5 text-[clamp(15px,2vw,25px)]">
                  <h1 className="max-[1800px]:text-[clamp(25px,2.8vw,50px)] min-[1800px]:text-[clamp(40px,2.6vw,60px)]">{title}</h1>
                   {canEdit === true ?  
                     (
                      <button  
                      onClick={ isEditing === true ? () => setIsEditing!(false) : () => setIsEditing!(true)}
                      >
                      { isEditing === true ? <FontAwesomeIcon icon={faSave} /> :
                        <FontAwesomeIcon icon={faPen} />} 
                    </button>
                    ) : 
                     ""
                  }
              </header>
              {children}
            </section>
              <footer className="mt-auto pt-4  relative l-1 h-[50px]">
               <span className="absolute right-6 bottom-0">
                  <Button  type="submit" size="medium" onClick={handleSubmit}>Sign Out</Button>
                </span>
            </footer>
       </section>
    )
}