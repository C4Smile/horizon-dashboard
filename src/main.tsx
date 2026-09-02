import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

// Provider
import {
  ThemeProvider,
  NotificationProvider,
  HorizonApiClientProvider,
  AccountProvider,
} from "providers";

// App
import App from "./App";

// i18
import "./i18.js";

// styles
import "./index.css";
import "./components/Forms/styles.css";

// fonts
import "@fontsource/poppins";

const root = document.getElementById("root");

if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
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
