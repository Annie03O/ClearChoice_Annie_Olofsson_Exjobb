import { Outlet } from "react-router-dom"
import { Header } from "../components/Header/Header"
import { Footer } from "../components/ul/Footer"

export const Layout = () => {

    return (
        <div className="flex flex-col min-h-screen w-screen overflow-x-hidden">
            <Header/>
               <section className="min-h-[calc(100vh-160px)] flex-1 w-full overflow-x-hidden">
                 <Outlet/>
               </section>
            <Footer/>
        </div>
    )
}