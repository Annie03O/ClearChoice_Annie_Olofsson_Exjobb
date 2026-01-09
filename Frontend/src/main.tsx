// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../src/styles/style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { HashRouter } from "react-router-dom"; // ✅ rätt paket

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);