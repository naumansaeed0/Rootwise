import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/fonts.css";
import "./styles/main.css";
import "./styles/system.css";
import "./styles/instruments.css";
import App from "./App";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
