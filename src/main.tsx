import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

// providers
import { HorizonProvider } from "providers";

// App
import App from "./app/App";

// i18
import "./i18.js";

// styles
import "@sito/dashboard-app/theme.css";
import "./index.css";
import "components/Forms/styles.css";

// fonts
import "@fontsource/poppins/index.css";

const root = document.getElementById("root");

if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
  <Router>
    <HorizonProvider>
      <App />
    </HorizonProvider>
  </Router>,
);
