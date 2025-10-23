import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Register } from "./pages/Nav/Auth/Register";
import { Home } from "./pages/Nav/Home";
import { Login } from "./pages/Nav/Auth/Login";
import { Profile } from "./pages/Nav/Auth/Profile";
import { ProtectedRoute } from "./components/Login/ProtectedRoute";
import { PersonalInfo } from "./pages/Nav/Auth/PersonalInfo";
import { SizeCalculatorPage } from "./pages/Nav/SizeCalculatorPage";
import { AllProducts } from "./pages/Nav/Products/AllProducts";
import { handleAddToCart, ProductPage, } from "./pages/Nav/Products/ProductPage";
import { ReviewPage } from "./pages/Nav/ReviewPage";
import { About } from "./pages/Nav/About";
import { Contact } from "./pages/Nav/Contact";
import { Messurements } from "./pages/Nav/Auth/Messurements";
import { AuthFSizeProvider } from "./components/SizeCalculator/Providers/Auth/AuthFSizeProvider";
import { CalcWTSize } from "./components/SizeCalculator/Calc/CalcWTSize";
import { CalcMTSize } from "./components/SizeCalculator/Calc/CalcTMSize";
import { CalcOSSize } from "./components/SizeCalculator/Calc/CalcOSSize";
import { products } from "./models/objects/products";
import { SearchResults } from "./components/Search/SearchResults";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: "Register",
                element: <Register/>
            },
            {
                path: "Login",
                element: <Login/>
            },
            {
                path: "dashboard",
                element: <ProtectedRoute>
                     <Profile/>
                </ProtectedRoute>
            }, 
            {
                path: "Personal_Information",
                element: <ProtectedRoute>
                    <PersonalInfo/>
                </ProtectedRoute>
            }, 
            {
                path: "/Size_Calculator",
                element: <SizeCalculatorPage/>
            },
            {
                path: "/Products",
                element: <AllProducts allProductsList={products} addToCart={handleAddToCart} />
            },
            {
                path: "/Products/:id",
                element: <ProductPage allProductsList={products} addToCart={handleAddToCart}/> 
            },
            {
                path: "search",
                element: <SearchResults/>
            },
            {
                path: "/Reviews",
                element: <ReviewPage/>
            },
            {
                path: "/About",
                element: <About/>
            },
            {
                path: "/Contact",
                element: <Contact/>
            }
        ],
        
    }, 
    {
                element: (
                    <AuthFSizeProvider>
                        <Layout/>
                    </AuthFSizeProvider>
                ),
                children: [
                    {
                        path: "/My_Messurements",
                        element: <Messurements/>
                    },
                    {
                        path: "/Calc/F",
                        element: <CalcWTSize/>
                    },
                    {
                        path: "/calc/M",
                        element: <CalcMTSize/>
                    },
                    {
                        path: "/calc/oversized",
                        element: <CalcOSSize/>
                    },

                ]
    }
    
])