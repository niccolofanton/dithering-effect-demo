import React, { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import "./styles.css";
import "./center.css";

import App from "./App";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
