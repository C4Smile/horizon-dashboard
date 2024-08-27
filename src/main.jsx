import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

// Provider
import ThemeProvider from "./utils/ThemeContext";
import { MuseumApiClientProvider } from "./providers/MuseumApiProvider";
import { AccountProvider } from "./providers/AccountProvider";
import { NotificationProvider } from "./providers/NotificationProvider.jsx";

// App
import App from "./App";

// i18
import "./i18.js";

// styles
import "./index.css";
import "./components/Forms/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <ThemeProvider>
      <MuseumApiClientProvider>
        <AccountProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AccountProvider>
      </MuseumApiClientProvider>
    </ThemeProvider>
  </Router>,
);
