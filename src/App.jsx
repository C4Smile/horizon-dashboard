import { Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import loadable from "@loadable/component";

// tippy styles
import "tippy.js/dist/tippy.css"; // optional

import "./css/style.css";

import "./charts/ChartjsConfig";

// providers
import { MuseumApiClientProvider } from "./providers/MuseumApiProvider";
import { NotificationProvider } from "./providers/NotificationProvider";
import { useAccount } from "./providers/AccountProvider";

// components
import SplashScreen from "./partials/loading/SplashScreen";

// layouts
const Auth = loadable(() => import("./layouts/Auth"));
const Dashboard = loadable(() => import("./layouts/Dashboard"));
const ModelNavigation = loadable(() => import("./layouts/ModelNavigation"));

// Import pages
// Auth
const SignIn = loadable(() => import("./pages/Auth/SignIn"));
const SignOut = loadable(() => import("./pages/Auth/SignOut"));
// Generals
const Home = loadable(() => import("./pages/Home"));
const Account = loadable(() => import("./pages/Account/Account"));
const NotFound = loadable(() => import("./pages/NotFound/NotFound"));
// customers
const Customers = loadable(() => import("./pages/Customers/Customers"));
const CustomerForm = loadable(() => import("./pages/Customers/CustomerForm"));
// currencies
const Currencies = loadable(() => import("./pages/Currencies/Currencies"));
const CurrencyForm = loadable(() => import("./pages/Currencies/CurrencyForm"));
// payment methods
const PaymentMethods = loadable(() => import("./pages/PaymentMethods/PaymentMethods"));
const PaymentMethodForm = loadable(() => import("./pages/PaymentMethods/PaymentMethodForm"));
// reservations
const Reservations = loadable(() => import("./pages/Reservations/Reservations"));
const ReservationForm = loadable(() => import("./pages/Reservations/ReservationForm"));
// invoices
const Invoices = loadable(() => import("./pages/Invoices/Invoices"));
const InvoiceForm = loadable(() => import("./pages/Invoices/InvoiceForm"));
// countries
const Countries = loadable(() => import("./pages/Countries/Countries"));
const CountryForm = loadable(() => import("./pages/Countries/CountryForm"));
// provinces
const Provinces = loadable(() => import("./pages/Provinces/Provinces"));
const ProvinceForm = loadable(() => import("./pages/Provinces/ProvinceForm"));
// rooms
const Rooms = loadable(() => import("./pages/Rooms/Rooms"));
const RoomForm = loadable(() => import("./pages/Rooms/RoomForm"));
// users
const Users = loadable(() => import("./pages/Users/Users"));
const UserForm = loadable(() => import("./pages/Users/UserForm"));

/**
 * Main App
 * @returns App Component
 */
function App() {
  const [loaded, setLoaded] = useState(true);

  const { logUserFromLocal } = useAccount();

  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  useEffect(() => {
    logUserFromLocal();
    setTimeout(() => {
      setLoaded(false);
    }, 1000);
  }, [logUserFromLocal]);

  return (
    <MuseumApiClientProvider>
      <SplashScreen visible={loaded} />
      <Suspense>
        <Routes>
          <Route
            exact
            path="/auth"
            element={
              <NotificationProvider>
                <Auth />
              </NotificationProvider>
            }
          >
            <Route index element={<SignIn />} />
          </Route>
          <Route path="/sign-out" element={<SignOut />} />
          <Route
            exact
            path="/"
            element={
              <NotificationProvider>
                <Dashboard />
              </NotificationProvider>
            }
          >
            <Route index element={<Home />} />
            <Route path="/settings/account" element={<Account />} />
            <Route
              exact
              path="/management/customers"
              element={<ModelNavigation parent="management" model="customers" />}
            >
              <Route index element={<Customers />} />
              <Route path="/management/customers/new" element={<CustomerForm />} />
              <Route path="/management/customers/:id" element={<CustomerForm />} />
            </Route>
            <Route
              exact
              path="/management/currencies"
              element={<ModelNavigation parent="management" model="currencies" />}
            >
              <Route index element={<Currencies />} />
              <Route path="/management/currencies/new" element={<CurrencyForm />} />
              <Route path="/management/currencies/:id" element={<CurrencyForm />} />
            </Route>
            <Route
              exact
              path="/management/paymentMethods"
              element={<ModelNavigation parent="management" model="paymentMethods" />}
            >
              <Route index element={<PaymentMethods />} />
              <Route path="/management/paymentMethods/new" element={<PaymentMethodForm />} />
              <Route path="/management/paymentMethods/:id" element={<PaymentMethodForm />} />
            </Route>
            <Route
              exact
              path="/management/reservations"
              element={<ModelNavigation parent="management" model="reservations" />}
            >
              <Route index element={<Reservations />} />
              <Route path="/management/reservations/new" element={<ReservationForm />} />
              <Route path="/management/reservations/:id" element={<ReservationForm />} />
            </Route>
            <Route
              exact
              path="/management/invoices"
              element={<ModelNavigation parent="management" model="invoices" />}
            >
              <Route index element={<Invoices />} />
              <Route path="/management/invoices/new" element={<InvoiceForm />} />
              <Route path="/management/invoices/:id" element={<InvoiceForm />} />
            </Route>
            <Route
              exact
              path="/management/countries"
              element={<ModelNavigation parent="management" model="countries" />}
            >
              <Route index element={<Countries />} />
              <Route path="/management/countries/new" element={<CountryForm />} />
              <Route path="/management/countries/:id" element={<CountryForm />} />
            </Route>
            <Route
              exact
              path="/management/provinces"
              element={<ModelNavigation parent="management" model="provinces" />}
            >
              <Route index element={<Provinces />} />
              <Route path="/management/provinces/new" element={<ProvinceForm />} />
              <Route path="/management/provinces/:id" element={<ProvinceForm />} />
            </Route>
            <Route
              exact
              path="/management/rooms"
              element={<ModelNavigation parent="management" model="rooms" />}
            >
              <Route index element={<Rooms />} />
              <Route path="/management/rooms/new" element={<RoomForm />} />
              <Route path="/management/rooms/:id" element={<RoomForm />} />
            </Route>
            <Route
              exact
              path="/personal/users"
              element={<ModelNavigation parent="personal" model="users" />}
            >
              <Route index element={<Users />} />
              <Route path="/personal/users/new" element={<UserForm />} />
              <Route path="/personal/users/:id" element={<UserForm />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </MuseumApiClientProvider>
  );
}

export default App;
