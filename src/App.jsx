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
              path="/museum/room-types"
              element={<ModelNavigation parent="museum" model="room-types" />}
            >
              <Route index element={<RoomTypes />} />
              <Route path="/museum/room-types/new" element={<RoomTypeForm />} />
              <Route path="/museum/room-types/:id" element={<RoomTypeForm />} />
            </Route>
            {/* Information */}
            <Route
              exact
              path="/museum/activities"
              element={<ModelNavigation parent="museum" model="activities" />}
            >
              <Route index element={<Activities />} />
              <Route path="/museum/activities/new" element={<ActivityForm />} />
              <Route path="/museum/activities/:id" element={<ActivityForm />} />
            </Route>
            <Route
              exact
              path="/activities/news"
              element={<ModelNavigation parent="activities" model="news" />}
            >
              <Route index element={<News />} />
              <Route path="/activities/news/new" element={<NewsForm />} />
              <Route path="/activities/news/:id" element={<NewsForm />} />
            </Route>
            <Route
              exact
              path="/activities/events"
              element={<ModelNavigation parent="activities" model="events" />}
            >
              <Route index element={<Events />} />
              <Route path="/activities/events/new" element={<EventForm />} />
              <Route path="/activities/events/:id" element={<EventForm />} />
            </Route>
            <Route
              exact
              path="/activities/tags"
              element={<ModelNavigation parent="activities" model="tags" />}
            >
              <Route index element={<Tags />} />
              <Route path="/activities/tags/new" element={<TagForm />} />
              <Route path="/activities/tags/:id" element={<TagForm />} />
            </Route>
            {/* Management */}
            <Route
              exact
              path="/management/push-notifications"
              element={<ModelNavigation parent="management" model="push-notifications" />}
            >
              <Route index element={<PushNotifications />} />
              <Route path="/management/push-notifications/new" element={<PushNotificationForm />} />
              <Route path="/management/push-notifications/:id" element={<PushNotificationForm />} />
            </Route>
            <Route
              exact
              path="/management/app-texts"
              element={<ModelNavigation parent="management" model="app-texts" />}
            >
              <Route index element={<AppTexts />} />
              <Route path="/management/app-texts/new" element={<AppTextForm />} />
              <Route path="/management/app-texts/:id" element={<AppTextForm />} />
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
