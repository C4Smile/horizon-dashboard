import { Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import loadable from "@loadable/component";

// tippy styles
import "tippy.js/dist/tippy.css"; // optional

import "./css/style.css";

import "./charts/ChartjsConfig";

// providers
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
const Recovery = loadable(() => import("./pages/Auth/Recovery"));
const UpdatePassword = loadable(() => import("./pages/Auth/UpdatePassword"));
// Generals
const Home = loadable(() => import("./pages/Home"));
const Account = loadable(() => import("./pages/Account/Account"));
const NotFound = loadable(() => import("./pages/NotFound/NotFound"));
// rooms
const Rooms = loadable(() => import("./pages/Rooms/Rooms"));
const RoomForm = loadable(() => import("./pages/Rooms/RoomForm"));
// roomAreas
const RoomAreas = loadable(() => import("./pages/RoomAreas/RoomAreas"));
const RoomAreaForm = loadable(() => import("./pages/RoomAreas/RoomAreaForm"));
// roomTypes
const RoomTypes = loadable(() => import("./pages/RoomTypes/RoomTypes"));
const RoomTypeForm = loadable(() => import("./pages/RoomTypes/RoomTypeForm"));
// users
const Users = loadable(() => import("./pages/Users/Users"));
const UserForm = loadable(() => import("./pages/Users/UserForm"));
// news
const News = loadable(() => import("./pages/News/News"));
const NewsForm = loadable(() => import("./pages/News/NewsForm"));
// events
const Events = loadable(() => import("./pages/Events/Events"));
const EventForm = loadable(() => import("./pages/Events/EventForm"));
// tags
const Tags = loadable(() => import("./pages/Tags/Tags"));
const TagForm = loadable(() => import("./pages/Tags/TagForm"));
// activities
const Activities = loadable(() => import("./pages/Activities/Activities"));
const ActivityForm = loadable(() => import("./pages/Activities/ActivityForm"));
// Service
const Services = loadable(() => import("./pages/Services/Services"));
const ServiceForm = loadable(() => import("./pages/Services/ServiceForm"));
// Service
const AppTexts = loadable(() => import("./pages/AppTexts/AppTexts"));
const AppTextForm = loadable(() => import("./pages/AppTexts/AppTextForm"));
// Push Notification
const PushNotifications = loadable(() => import("./pages/PushNotifications/PushNotifications"));
const PushNotificationForm = loadable(() => import("./pages/PushNotifications/PushNotificationForm"));
// Guest Book
const GuestBooks = loadable(() => import("./pages/GuestBooks/GuestBooks"));
const GuestBookForm = loadable(() => import("./pages/GuestBooks/GuestBookForm"));
// Sort Rooms
const SortRooms = loadable(() => import("./pages/SortRooms/SortRooms"));

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
    <>
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
            <Route path="/auth/recovery" element={<Recovery />} />
            <Route path="/auth/update-password" element={<UpdatePassword />} />
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
            {/* Museum */}
            <Route
              exact
              path="/museum/services"
              element={<ModelNavigation parent="museum" model="services" />}
            >
              <Route index element={<Services />} />
              <Route path="/museum/services/new" element={<ServiceForm />} />
              <Route path="/museum/services/:id" element={<ServiceForm />} />
            </Route>
            <Route
              exact
              path="/museum/rooms"
              element={<ModelNavigation parent="museum" model="rooms" />}
            >
              <Route index element={<Rooms />} />
              <Route path="/museum/rooms/new" element={<RoomForm />} />
              <Route path="/museum/rooms/:id" element={<RoomForm />} />
            </Route>
            <Route
              exact
              path="/museum/roomAreas"
              element={<ModelNavigation parent="museum" model="roomAreas" />}
            >
              <Route index element={<RoomAreas />} />
              <Route path="/museum/roomAreas/new" element={<RoomAreaForm />} />
              <Route path="/museum/roomAreas/:id" element={<RoomAreaForm />} />
            </Route>
            <Route exact path="/museum/sortRooms" element={<SortRooms />} />
            <Route
              exact
              path="/museum/roomTypes"
              element={<ModelNavigation parent="museum" model="roomTypes" />}
            >
              <Route index element={<RoomTypes />} />
              <Route path="/museum/roomTypes/new" element={<RoomTypeForm />} />
              <Route path="/museum/roomTypes/:id" element={<RoomTypeForm />} />
            </Route>
            <Route
              exact
              path="/museum/guestBooks"
              element={<ModelNavigation parent="museum" model="guestBooks" />}
            >
              <Route index element={<GuestBooks />} />
              <Route path="/museum/guestBooks/new" element={<GuestBookForm />} />
              <Route path="/museum/guestBooks/:id" element={<GuestBookForm />} />
            </Route>
            {/* Information */}
            <Route
              exact
              path="/information/activities"
              element={<ModelNavigation parent="information" model="activities" />}
            >
              <Route index element={<Activities />} />
              <Route path="/information/activities/new" element={<ActivityForm />} />
              <Route path="/information/activities/:id" element={<ActivityForm />} />
            </Route>
            <Route
              exact
              path="/information/news"
              element={<ModelNavigation parent="information" model="news" />}
            >
              <Route index element={<News />} />
              <Route path="/information/news/new" element={<NewsForm />} />
              <Route path="/information/news/:id" element={<NewsForm />} />
            </Route>
            <Route
              exact
              path="/information/events"
              element={<ModelNavigation parent="information" model="events" />}
            >
              <Route index element={<Events />} />
              <Route path="/information/events/new" element={<EventForm />} />
              <Route path="/information/events/:id" element={<EventForm />} />
            </Route>
            <Route
              exact
              path="/information/tags"
              element={<ModelNavigation parent="information" model="tags" />}
            >
              <Route index element={<Tags />} />
              <Route path="/information/tags/new" element={<TagForm />} />
              <Route path="/information/tags/:id" element={<TagForm />} />
            </Route>
            {/* Management */}
            <Route
              exact
              path="/management/pushNotifications"
              element={<ModelNavigation parent="management" model="pushNotifications" />}
            >
              <Route index element={<PushNotifications />} />
              <Route path="/management/pushNotifications/new" element={<PushNotificationForm />} />
              <Route path="/management/pushNotifications/:id" element={<PushNotificationForm />} />
            </Route>
            <Route
              exact
              path="/management/appTexts"
              element={<ModelNavigation parent="management" model="appTexts" />}
            >
              <Route index element={<AppTexts />} />
              <Route path="/management/appTexts/new" element={<AppTextForm />} />
              <Route path="/management/appTexts/:id" element={<AppTextForm />} />
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
    </>
  );
}

export default App;
