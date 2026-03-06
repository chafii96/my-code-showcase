import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Force single React instance
if (typeof window !== 'undefined') {
  (window as any).__REACT__ = React;
}

createRoot(document.getElementById("root")!).render(<App />);
