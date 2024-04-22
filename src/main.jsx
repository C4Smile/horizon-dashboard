import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

// Provider
import ThemeProvider from "./utils/ThemeContext";
import { HotelApiClientProvider } from "./providers/HotelApiProvider";
import { AccountProvider } from "./providers/AccountProvider";

// App
import App from "./App";

// i18
import "./i18.js";

// styles
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <ThemeProvider>
      <HotelApiClientProvider>
        <AccountProvider>
          <App />
        </AccountProvider>
      </HotelApiClientProvider>
    </ThemeProvider>
  </Router>,
);
