import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

// Provider
import ThemeProvider from "./utils/ThemeContext";
import { HorizonApiClientProvider } from "./providers/HorizonApiProvider";
import { AccountProvider } from "./providers/AccountProvider";
import { NotificationProvider } from "./providers/NotificationProvider.jsx";

// App
import App from "./App";

// i18
import "./i18.js";

// styles
import "./index.css";
import "./components/Forms/styles.css";

// fonts
import "@fontsource/poppins";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <ThemeProvider>
      <HorizonApiClientProvider>
        <AccountProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AccountProvider>
      </HorizonApiClientProvider>
    </ThemeProvider>
  </Router>,
);
