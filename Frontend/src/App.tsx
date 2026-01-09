// App.tsx
import { RouterProvider } from "react-router-dom"; // <-- rätt paket
import { router } from "./Router";
import { AuthFSizeProvider } from "./components/SizeCalculator/Providers/Auth/AuthFSizeProvider";
import { LoginUserProvider } from "./components/Login/LoginUserProvider";
import { CartProvider } from "./components/Cart/CartProvider";
import { SavedProvider } from "./components/Saved/SavedProvider";
import { CheckoutProvider } from "./components/Checkout/CheckoutProvider";

export default function App() {
  return (
    <CheckoutProvider>
      <SavedProvider>  
        <LoginUserProvider>
          <CartProvider>
              <AuthFSizeProvider>
                <RouterProvider router={router} />
              </AuthFSizeProvider>
            </CartProvider>
          </LoginUserProvider>
      </SavedProvider>
    </CheckoutProvider>
  );
}
