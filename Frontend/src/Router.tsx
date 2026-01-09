import { createHashRouter, Outlet } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Register } from "./pages/Nav/Auth/Register";
import { Home } from "./pages/Nav/Home";
import { Profile } from "./pages/Nav/Auth/Profile";
import { ProtectedRoute } from "./components/Login/ProtectedRoute";
import { PersonalInfo } from "./pages/Nav/Auth/PersonalInfo";
import { SizeCalculatorPage } from "./pages/Nav/SizeCalculatorPage";
import { AllProducts, handleAddToCart } from "./pages/Nav/Products/AllProducts";
import {  ProductPage, } from "./pages/Nav/Products/ProductPage";
import { ReviewPage } from "./pages/Nav/ReviewPage";
import { Messurements } from "./pages/Nav/Auth/Messurements";
import { AuthFSizeProvider } from "./components/SizeCalculator/Providers/Auth/AuthFSizeProvider";
import { products } from "./models/objects/products";
import { SearchResults } from "./components/Search/SearchResults";
import { CalcSize } from "./components/SizeCalculator/Calc/CalcSize";
import { tshirtSizesF } from "./models/objects/sizeCalculator/tshirtSizesF";
import { tshirtSizesM } from "./models/objects/sizeCalculator/tshirtsSizesM";
import { oversizedFit } from "./models/objects/sizeCalculator/oversizedFit";
import { CartPage } from "./pages/Checkout/CartPage";
import { Checkout } from "./pages/Checkout/Checkout";
import { ReceiptPage } from "./pages/Checkout/ReceiptPage";
import { OrderHistory } from "./pages/Nav/Auth/OrderHistory";
import { OrderDetails } from "./pages/Nav/Auth/OrderDetails";


export const router = createHashRouter([
    {
        path: "/",
        element: <Layout/>,
        handle: { 
            crumb: () => (
                { 
                    label: "Home", 
                    to: "/" 
                }
            ) 
        },
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: "Register",
                element: <Register/>,
                handle: {
                    crumb: () => ({ label: "Register", to: "/Register" }),
                }
            },
            {
              path: "dashboard",
              element: (
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              ),
                handle: {
                    crumb: () => ({ label: "Profile", to: "/dashboard" }),
                }
            },
            {
              path: "dashboard/Personal_Information",
              element: (
                <ProtectedRoute>
                  <PersonalInfo />
                </ProtectedRoute>
              ),
                handle: {
                    crumb: () => ({ label: "Personal Information", to: "/dashboard/Personal_Information" }),
                }
            },
            {
              path: "dashboard/My_Messurements",
              element: (
                <ProtectedRoute>
                  <Messurements />
                </ProtectedRoute>
              ),
                handle: {
                    crumb: () => ({ label: "My Messurements", to: "/dashboard/My_Messurements" }),
                }
            },
            {
                path: "dashboard/Order_History",
                element: (
                    <ProtectedRoute>
                        <OrderHistory/>
                    </ProtectedRoute>
                ),
                handle: {
                    crumb: () => ({ label: "Order History", to: "/dashboard/Order_History" }),
                }
            },
            {
                path: "dashboard/Order_History/OrderDetails",
                element: (
                    <ProtectedRoute>
                        <OrderDetails/>
                    </ProtectedRoute>
                ),
                handle: {
                    crumb: () => ({ label: "Order Details", to: "/dashboard/Order_History/OrderDetails" }),
                }
            },

            {
                path: "Size_Calculator",
                element: <SizeCalculatorPage/>,
                handle: {
                    crumb: () => ({ label: "Size Calculator", to: "/Size_Calculator" }),
                }
            },
            {
              path: "Products",
              element: <Outlet />,
              handle: {
                crumb: () => ({ label: "Products", to: "/Products" }),
              },
              children: [
                {
                  index: true,
                  element: <AllProducts allProductsList={products} addToCart={handleAddToCart} />,
                },
                {
                  path: ":id",
                  element: <ProductPage />,
                  handle: {
                    crumb: (m: any) => {
                      const id = m.params.id;
                      const product = products.find(p => p.id === id);
                      return { label: product?.label ?? "Product Details" };
                    },
                  },
                },
              ],
            },


            
            {
                path: "search",
                element: <SearchResults  addToCart={handleAddToCart}/>
            },
            {
                path: "Reviews",
                element: <ReviewPage/>
            },
            {
                path: "Cart", 
                element: <CartPage/>,
                handle: {
                    crumb: () => ({ label: "Cart", to: "/Cart" }),
                }
            },
            {
            }, 
            {
                path: "Checkout",
                element: <Checkout/>,
                handle: {
                    crumb: () => ({ label: "Checkout", to: "/Checkout" }),
                }
            },
            {
                path: "Receipt/:orderId",
                element: <ReceiptPage/>,
                handle: {
                    crumb: () => ({ label: "Receipt", to: "/Receipt/:orderId" }),
                }
            },
        ],
        
    }, 
    {
        path: "",
        element: (
            <AuthFSizeProvider>
                <Layout/>
            </AuthFSizeProvider>
        ),
        children: [
            {
                path: "My_Messurements",
                element: <Messurements/>
            },
            {
                path: "Calc/F",
                element: <CalcSize id="F-size" model={tshirtSizesF} title="T-Shirts for Women"/>
            },
            {
                path: "Calc/M",
                element: <CalcSize id="M-size" model={tshirtSizesM} title="T-Shirts for Men"/>

            },
            {
                path: "Calc/Oversized",
                element:<CalcSize id="OS-size" model={oversizedFit} title="Hoodies/Sweatshirts"/>

            },

        ]
    }
    
])