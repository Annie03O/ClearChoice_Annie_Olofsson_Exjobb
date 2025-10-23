// App.tsx
import { RouterProvider } from "react-router-dom"; // <-- rätt paket
import { router } from "./Router";
import { AuthSizeProvider } from "./components/SizeCalculator/Providers/Auth/AuthSizeProvider";
import { AuthUserProvider } from "./components/Login/AuthUserProvider";

export default function App() {
  return (
    <AuthUserProvider>
      <AuthSizeProvider>
        <RouterProvider router={router} />
      </AuthSizeProvider>
    </AuthUserProvider>
  );
}
