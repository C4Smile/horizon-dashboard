import React, { Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import loadable from "@loadable/component";
import supabase from "./db/connection";

import "./css/style.css";

import "./charts/ChartjsConfig";

// providers
import { HotelApiClientProvider } from "./providers/HotelApiProvider";

// components
import SplashScreen from "./partials/loading/SplashScreen";

// layouts
const Dashboard = loadable(() => import("./layouts/Dashboard"));
const ModelNavigation = loadable(() => import("./layouts/ModelNavigation"));

// Import pages
const Home = loadable(() => import("./pages/Home"));
// customers
const Customers = loadable(() => import("./pages/Customers/Customers"));
const CustomerForm = loadable(() => import("./pages/Customers/CustomerForm"));
// reservations
const Reservations = loadable(() => import("./pages/Reservations/Reservations"));
const ReservationForm = loadable(() => import("./pages/Reservations/ReservationForm"));
// invoices
const Invoices = loadable(() => import("./pages/Invoices/Invoices"));
const InvoiceForm = loadable(() => import("./pages/Invoices/InvoiceForm"));
// rooms
const Rooms = loadable(() => import("./pages/Rooms/Rooms"));
const RoomForm = loadable(() => import("./pages/Rooms/RoomForm"));
// room types
const RoomTypes = loadable(() => import("./pages/RoomTypes/RoomTypes"));
const RoomTypeForm = loadable(() => import("./pages/RoomTypes/RoomTypeForm"));
// users
const Users = loadable(() => import("./pages/Users/Users"));
const UserForm = loadable(() => import("./pages/Users/UserForm"));

/**
 * Main App
 * @returns App Component
 */
function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  const a = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "sito8943@gmail.com",
      password: "12345679",
    });
    console.log(data, error);
  };

  useEffect(() => {
    a();
  }, []);

  return (
    <HotelApiClientProvider>
      <Suspense fallback={<SplashScreen />}>
        <Routes>
          <Route exact path="/" element={<Dashboard />}>
            <Route index element={<Home />} />
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
              path="/management/rooms"
              element={<ModelNavigation parent="management" model="rooms" />}
            >
              <Route index element={<Rooms />} />
              <Route path="/management/rooms/new" element={<RoomForm />} />
              <Route path="/management/rooms/:id" element={<RoomForm />} />
            </Route>
            <Route
              exact
              path="/management/room-types"
              element={<ModelNavigation parent="management" model="room-types" />}
            >
              <Route index element={<RoomTypes />} />
              <Route path="/management/room-types/new" element={<RoomTypeForm />} />
              <Route path="/management/room-types/:id" element={<RoomTypeForm />} />
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
        </Routes>
      </Suspense>
    </HotelApiClientProvider>
  );
}

export default App;
