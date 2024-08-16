import { Role } from "../api/RoleApiClient";

// layouts
import Auth from "../layouts/Auth";
import Dashboard from "../layouts/Dashboard";
import ModelNavigation from "../layouts/ModelNavigation";

// pages
// auth
import SignIn from "./Auth/SignIn";
import Recovery from "./Auth/Recovery";
import UpdatePassword from "./Auth/UpdatePassword";
// dashboard
import Home from "./Home";
import Account from "./Account/Account";
// museum
// services
import ServicesPage from "./Services/Services";
import ServiceForm from "./Services/ServiceForm";
// room
import RoomsPage from "./Rooms/Rooms";
import RoomForm from "./Rooms/RoomForm";
// roomArea
import RoomAreasPage from "./RoomAreas/RoomAreas";
import RoomAreaForm from "./RoomAreas/RoomAreaForm";
// roomType
import RoomTypesPage from "./RoomTypes/RoomTypes";
import RoomTypeForm from "./RoomTypes/RoomTypeForm";
// information
// activity
import ActivitiesPage from "./Activities/Activities";
import ActivityForm from "./Activities/ActivityForm";
// news
import NewsPage from "./News/News";
import NewsForm from "./News/NewsForm";
// event
import EventsPage from "./Events/Events";
import EventForm from "./Events/EventForm";
// tag
import TagsPage from "./Tags/Tags";
import TagForm from "./Tags/TagForm";
// management
import PushNotificationsPage from "./PushNotifications/PushNotifications";
import PushNotificationForm from "./PushNotifications/PushNotificationForm";
// appTexts
import AppTextsPage from "./AppTexts/AppTexts";
import AppTextForm from "./AppTexts/AppTextForm";
// personal
import UsersPage from "./Users/Users";
import UserForm from "./Users/UserForm";

export const pageId = {
  auth: "auth",
  signIn: "signIn",
  recovery: "recovery",
  updatePassword: "updatePassword",
  dashboard: "dashboard",
  home: "home",
  settings: "settings",
  // museum
  services: "services",
  servicesNew: "servicesNew",
  servicesEdit: "servicesEdit",
  rooms: "rooms",
  roomsNew: "roomsNew",
  roomsEdit: "roomsEdit",
  roomAreas: "roomAreas",
  roomAreasNew: "roomAreasNew",
  roomAreasEdit: "roomAreasEdit",
  roomTypes: "roomTypes",
  roomTypesNew: "roomTypesNew",
  roomTypesEdit: "roomTypesEdit",
  // information
  activities: "activities",
  activitiesNew: "activitiesNew",
  activitiesEdit: "activitiesEdit",
  news: "news",
  newsNew: "newsNew",
  newsEdit: "newsEdit",
  events: "events",
  eventsNew: "eventsNew",
  eventsEdit: "eventsEdit",
  tags: "tags",
  tagsNew: "tagsNew",
  tagsEdit: "tagsEdit",
  // management
  pushNotifications: "pushNotifications",
  pushNotificationsNew: "pushNotificationsNew",
  pushNotificationsEdit: "pushNotificationsEdit",
  appTexts: "appTexts",
  appTextsNew: "appTextsNew",
  appTextsEdit: "appTextsEdit",
  // personal
  users: "users",
  usersNew: "usersNew",
  usersEdit: "usersEdit",
};

export const sitemap = [
  {
    key: pageId.auth,
    component: <Auth />,
    path: "/auth",
    children: [
      {
        key: pageId.signIn,
        path: "/",
        component: <SignIn />,
      },
      {
        key: pageId.recovery,
        path: "/recovery",
        component: <Recovery />,
      },
      {
        key: pageId.updatePassword,
        path: "/update-password",
        component: <UpdatePassword />,
      },
    ],
  },
  {
    key: pageId.dashboard,
    path: "/",
    component: <Dashboard />,
    children: [
      { key: pageId.home, path: "/", component: <Home /> },
      { key: pageId.settings, path: "/settings/account", component: <Account /> },
      // museum
      {
        key: pageId.services,
        path: "/museum/services",
        component: <ModelNavigation parent="museum" model="services" />,
        role: [Role.administrator, Role.museologist],
        children: [
          { key: pageId.services, path: "/", component: <ServicesPage /> },
          { key: pageId.servicesNew, path: "/new", component: <ServiceForm /> },
          { key: pageId.servicesEdit, path: "/:id", component: <ServiceForm /> },
        ],
      },
      {
        key: pageId.rooms,
        path: "/museum/rooms",
        role: [Role.administrator, Role.museologist],
        component: <ModelNavigation parent="museum" model="room" />,
        children: [
          { key: pageId.rooms, path: "/", component: <RoomsPage /> },
          { key: pageId.roomsNew, path: "/new", component: <RoomForm /> },
          { key: pageId.roomsEdit, path: "/:id", component: <RoomForm /> },
        ],
      },
      {
        key: pageId.roomAreas,
        path: "/museum/roomAreas",
        role: [Role.administrator, Role.museologist],
        component: <ModelNavigation parent="museum" model="roomAreas" />,
        children: [
          { key: pageId.roomAreas, path: "/", component: <RoomAreasPage /> },
          { key: pageId.roomAreasNew, path: "/new", component: <RoomAreaForm /> },
          { key: pageId.roomAreasEdit, path: "/:id", component: <RoomAreaForm /> },
        ],
      },
      {
        key: pageId.roomTypes,
        path: "/museum/roomTypes",
        role: [Role.administrator, Role.museologist],
        component: <ModelNavigation parent="museum" model="roomTypes" />,
        children: [
          { key: pageId.roomTypes, path: "/", component: <RoomTypesPage /> },
          { key: pageId.roomTypesNew, path: "/new", component: <RoomTypeForm /> },
          { key: pageId.roomTypesEdit, path: "/:id", component: <RoomTypeForm /> },
        ],
      },
      // activities
      {
        key: pageId.activities,
        path: "/information/activities",
        role: [Role.administrator, Role.communicator],
        component: <ModelNavigation parent="information" model="activities" />,
        children: [
          { key: pageId.activities, path: "/", component: <ActivitiesPage /> },
          { key: pageId.activitiesNew, path: "/new", component: <ActivityForm /> },
          { key: pageId.activitiesEdit, path: "/:id", component: <ActivityForm /> },
        ],
      },
      {
        key: pageId.news,
        path: "/information/news",
        role: [Role.administrator, Role.communicator],
        component: <ModelNavigation parent="information" model="news" />,
        children: [
          { key: pageId.news, path: "/", component: <NewsPage /> },
          { key: pageId.newsNew, path: "/new", component: <NewsForm /> },
          { key: pageId.newsEdit, path: "/:id", component: <NewsForm /> },
        ],
      },
      {
        key: pageId.events,
        path: "/information/event",
        role: [Role.administrator, Role.communicator],
        component: <ModelNavigation parent="information" model="events" />,
        children: [
          { key: pageId.events, path: "/", component: <EventsPage /> },
          { key: pageId.eventsNew, path: "/new", component: <EventForm /> },
          { key: pageId.eventsEdit, path: "/:id", component: <EventForm /> },
        ],
      },
      {
        key: pageId.tags,
        path: "/information/tags",
        role: [Role.administrator, Role.communicator],
        component: <ModelNavigation parent="information" model="tags" />,
        children: [
          { key: pageId.tags, path: "/", component: <TagsPage /> },
          { key: pageId.tagsNew, path: "/new", component: <TagForm /> },
          { key: pageId.tagsEdit, path: "/:id", component: <TagForm /> },
        ],
      },
      // management
      {
        key: pageId.pushNotifications,
        path: "/management/pushNotifications",
        role: [Role.administrator, Role.communicator],
        component: <ModelNavigation parent="management" model="pushNotifications" />,
        children: [
          { key: pageId.pushNotifications, path: "/", component: <PushNotificationsPage /> },
          { key: pageId.pushNotificationsNew, path: "/new", component: <PushNotificationForm /> },
          { key: pageId.pushNotificationsEdit, path: "/:id", component: <PushNotificationForm /> },
        ],
      },
      {
        key: pageId.appTexts,
        path: "/management/appTexts",
        role: [Role.administrator, Role.communicator],
        component: <ModelNavigation parent="management" model="appTexts" />,
        children: [
          { key: pageId.appTexts, path: "/", component: <AppTextsPage /> },
          { key: pageId.appTextsNew, path: "/new", component: <AppTextForm /> },
          { key: pageId.appTextsEdit, path: "/:id", component: <AppTextForm /> },
        ],
      },
      // personal
      {
        key: pageId.users,
        path: "/personal/users",
        role: [Role.administrator],
        component: <ModelNavigation parent="personal" model="users" />,
        children: [
          { key: pageId.users, path: "/", component: <UsersPage /> },
          { key: pageId.usersNew, path: "/new", component: <UserForm /> },
          { key: pageId.usersEdit, path: "/:id", component: <UserForm /> },
        ],
      },
    ],
  },
];
