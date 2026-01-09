// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../src/styles/style.css"
// src/main.tsx eller src/index.tsx
import '@fortawesome/fontawesome-free/css/all.min.css';
import { HashRouter } from "react-router";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <App />
   </React.StrictMode>
);
