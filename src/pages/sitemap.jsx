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
// devices
import Applications from "./Applications/Applications";
import ApplicationForm from "./Applications/ApplicationForm";
import Translations from "./Applications/Translations";
// museum
// services
import ServicesPage from "./Services/Services";
import ServiceForm from "./Services/ServiceForm";
// room
import RoomsPage from "./Rooms/Rooms";
import RoomForm from "./Rooms/RoomForm";
import SortRooms from "./SortRooms/SortRooms";
// roomArea
import RoomAreasPage from "./RoomAreas/RoomAreas";
import RoomAreaForm from "./RoomAreas/RoomAreaForm";
// roomType
import RoomTypesPage from "./RoomTypes/RoomTypes";
import RoomTypeForm from "./RoomTypes/RoomTypeForm";
// guestBook
import GuestBooksPage from "./GuestBooks/GuestBooks";
import GuestBookForm from "./GuestBooks/GuestBookForm";
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
// pushNotifications
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
  // devices
  statuses: "statuses",
  applications: "applications",
  translations: "translations",
  // museum
  services: "services",
  servicesNew: "servicesNew",
  servicesEdit: "servicesEdit",
  rooms: "rooms",
  roomsNew: "roomsNew",
  roomsEdit: "roomsEdit",
  sortRooms: "sortRooms",
  roomAreas: "roomAreas",
  roomAreasNew: "roomAreasNew",
  roomAreasEdit: "roomAreasEdit",
  roomTypes: "roomTypes",
  roomTypesNew: "roomTypesNew",
  roomTypesEdit: "roomTypesEdit",
  guestBooks: "guestBooks",
  guestBooksNew: "guestBooksNew",
  guestBooksEdit: "guestBooksEdit",
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
    path: "/autentificacion",
    children: [
      {
        key: pageId.signIn,
        path: "/",
        component: <SignIn />,
      },
      {
        key: pageId.recovery,
        path: "/recuperar",
        component: <Recovery />,
      },
      {
        key: pageId.updatePassword,
        path: "/cambiar-contrasena",
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
      { key: pageId.settings, path: "/ajustes/cuenta", component: <Account /> },
      // devices
      {
        key: pageId.statuses,
        path: "/dispositivos/estados",
        component: <></>,
        role: [],
      },
      {
        key: pageId.applications,
        path: "/dispositivos/aplicaciones",
        component: <ModelNavigation parent="dispositivos" model="aplicaciones" />,
        role: [Role.administrator],
        children: [
          { key: pageId.services, path: "/", component: <Applications /> },
          { key: pageId.servicesNew, path: "/nuevo", component: <ApplicationForm /> },
          { key: pageId.servicesEdit, path: "/:id", component: <ApplicationForm /> },
        ],
      },
      {
        key: pageId.translations,
        path: "/dispositivos/traducciones",
        component: <Translations />,
        role: [Role.administrator, Role.museologist],
      },
      {
        key: pageId.statuses,
        path: "/dispositivos/estados",
        component: <></>,
        role: [],
      },
      // museum
      {
        key: pageId.services,
        path: "/museo/servicios",
        component: <ModelNavigation parent="museo" model="servicios" />,
        role: [Role.administrator, Role.museologist],
        children: [
          { key: pageId.services, path: "/", component: <ServicesPage /> },
          { key: pageId.servicesNew, path: "/nuevo", component: <ServiceForm /> },
          { key: pageId.servicesEdit, path: "/:id", component: <ServiceForm /> },
        ],
      },
      {
        key: pageId.rooms,
        path: "/museo/salas",
        role: [Role.administrator, Role.museologist],
        component: <ModelNavigation parent="museo" model="salas" />,
        children: [
          { key: pageId.rooms, path: "/", component: <RoomsPage /> },
          { key: pageId.roomsNew, path: "/nuevo", component: <RoomForm /> },
          { key: pageId.roomsEdit, path: "/:id", component: <RoomForm /> },
        ],
      },
      {
        key: pageId.sortRooms,
        path: "/museo/ordenarSalas",
        role: [Role.administrator, Role.museologist],
        component: <SortRooms />,
      },
      {
        key: pageId.roomAreas,
        path: "/museo/areasDeSalas",
        role: [Role.administrator, Role.museologist],
        component: <ModelNavigation parent="museo" model="areasDeSalas" />,
        children: [
          { key: pageId.roomAreas, path: "/", component: <RoomAreasPage /> },
          { key: pageId.roomAreasNew, path: "/nuevo", component: <RoomAreaForm /> },
          { key: pageId.roomAreasEdit, path: "/:id", component: <RoomAreaForm /> },
        ],
      },
      {
        key: pageId.roomTypes,
        path: "/museo/tiposDeSalas",
        role: [Role.administrator, Role.museologist],
        component: <ModelNavigation parent="museo" model="tiposDeSalas" />,
        children: [
          { key: pageId.roomTypes, path: "/", component: <RoomTypesPage /> },
          { key: pageId.roomTypesNew, path: "/nuevo", component: <RoomTypeForm /> },
          { key: pageId.roomTypesEdit, path: "/:id", component: <RoomTypeForm /> },
        ],
      },
      {
        key: pageId.guestBooks,
        path: "/museo/libroDeVisitas",
        role: [Role.administrator, Role.museologist],
        component: <ModelNavigation parent="museo" model="libroDeVisitas" />,
        children: [
          { key: pageId.guestBooks, path: "/", component: <GuestBooksPage /> },
          { key: pageId.guestBooksNew, path: "/nuevo", component: <GuestBookForm /> },
          { key: pageId.guestBooksEdit, path: "/:id", component: <GuestBookForm /> },
        ],
      },
      // activities
      {
        key: pageId.activities,
        path: "/informacion/actividades",
        role: [Role.administrator, Role.communicator],
        component: <ModelNavigation parent="informacion" model="actividades" />,
        children: [
          { key: pageId.activities, path: "/", component: <ActivitiesPage /> },
          { key: pageId.activitiesNew, path: "/nuevo", component: <ActivityForm /> },
          { key: pageId.activitiesEdit, path: "/:id", component: <ActivityForm /> },
        ],
      },
      {
        key: pageId.news,
        path: "/informacion/noticias",
        role: [Role.administrator, Role.communicator],
        component: <ModelNavigation parent="informacion" model="noticias" />,
        children: [
          { key: pageId.news, path: "/", component: <NewsPage /> },
          { key: pageId.newsNew, path: "/nuevo", component: <NewsForm /> },
          { key: pageId.newsEdit, path: "/:id", component: <NewsForm /> },
        ],
      },
      {
        key: pageId.events,
        path: "/informacion/eventos",
        role: [Role.administrator, Role.communicator],
        component: <ModelNavigation parent="informacion" model="eventos" />,
        children: [
          { key: pageId.events, path: "/", component: <EventsPage /> },
          { key: pageId.eventsNew, path: "/nuevo", component: <EventForm /> },
          { key: pageId.eventsEdit, path: "/:id", component: <EventForm /> },
        ],
      },
      {
        key: pageId.tags,
        path: "/informacion/etiquetas",
        role: [Role.administrator, Role.communicator],
        component: <ModelNavigation parent="informacion" model="etiquetas" />,
        children: [
          { key: pageId.tags, path: "/", component: <TagsPage /> },
          { key: pageId.tagsNew, path: "/nuevo", component: <TagForm /> },
          { key: pageId.tagsEdit, path: "/:id", component: <TagForm /> },
        ],
      },
      // management
      {
        key: pageId.pushNotifications,
        path: "/gestion/notificaciones",
        role: [Role.administrator, Role.communicator],
        component: <ModelNavigation parent="gestion" model="notificaciones" />,
        children: [
          { key: pageId.pushNotifications, path: "/", component: <PushNotificationsPage /> },
          { key: pageId.pushNotificationsNew, path: "/nuevo", component: <PushNotificationForm /> },
          { key: pageId.pushNotificationsEdit, path: "/:id", component: <PushNotificationForm /> },
        ],
      },
      {
        key: pageId.appTexts,
        path: "/gestion/traducciones",
        role: [Role.administrator, Role.communicator],
        component: <ModelNavigation parent="gestion" model="traducciones" />,
        children: [
          { key: pageId.appTexts, path: "/", component: <AppTextsPage /> },
          { key: pageId.appTextsNew, path: "/nuevo", component: <AppTextForm /> },
          { key: pageId.appTextsEdit, path: "/:id", component: <AppTextForm /> },
        ],
      },
      // personal
      {
        key: pageId.users,
        path: "/personal/usuarios",
        role: [Role.administrator],
        component: <ModelNavigation parent="personal" model="usuarios" />,
        children: [
          { key: pageId.users, path: "/", component: <UsersPage /> },
          { key: pageId.usersNew, path: "/nuevo", component: <UserForm /> },
          { key: pageId.usersEdit, path: "/:id", component: <UserForm /> },
        ],
      },
    ],
  },
];
