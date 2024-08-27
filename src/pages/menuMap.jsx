import { Role } from "../api/RoleApiClient";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faChartLine,
  faComputer,
  faGear,
  faRss,
  faTableList,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export const menuKeys = {
  Dashboard: "dashboard",
  Devices: "devices",
  Museum: "museum",
  Information: "information",
  Management: "management",
  Personal: "personal",
  Settings: "settings",
};

export const submenuKeys = {
  Main: "main",
  // devices
  Statuses: "statuses",
  Applications: "applications",
  Translations: "translations",
  // museum
  Services: "services",
  Rooms: "rooms",
  RoomAreas: "roomAreas",
  SortRooms: "sortRooms",
  RoomTypes: "roomTypes",
  GuestBooks: "guestBooks",
  // activities
  Activities: "activities",
  News: "news",
  Events: "events",
  Tags: "tags",
  // management
  PushNotifications: "pushNotifications",
  AppTexts: "appTexts",
  // personal
  Users: "users",
  Account: "account",
};

export const menuMap = [
  {
    page: menuKeys.Dashboard,
    path: "/",
    icon: <FontAwesomeIcon icon={faChartLine} />,
    child: [{ label: submenuKeys.Main, path: "/" }],
  },
  {
    page: menuKeys.Devices,
    path: "/dispositivos",
    icon: <FontAwesomeIcon icon={faComputer} />,
    child: [
      { label: submenuKeys.Statuses, path: "/" },
      { label: submenuKeys.Applications, path: "/aplicaciones" },
      { label: submenuKeys.Translations, path: "/traducciones" },
    ],
  },
  {
    page: menuKeys.Museum,
    path: "/museo",
    icon: <FontAwesomeIcon icon={faBuildingColumns} />,
    role: [Role.administrator, Role.museologist],
    child: [
      {
        label: submenuKeys.Services,
        path: "/servicios",
      },
      {
        label: submenuKeys.Rooms,
        path: "/salass",
      },
      {
        label: submenuKeys.RoomAreas,
        path: "/areasDeSalas",
      },
      {
        label: submenuKeys.SortRooms,
        path: "/ordenarSalas",
      },
      {
        label: submenuKeys.RoomTypes,
        path: "/tiposDeSalas",
      },
      {
        label: submenuKeys.GuestBooks,
        path: "/libroDeVisitas",
      },
    ],
  },
  {
    page: menuKeys.Information,
    path: "/informacion",
    icon: <FontAwesomeIcon icon={faRss} />,
    role: [Role.administrator, Role.communicator],
    child: [
      {
        label: submenuKeys.Activities,
        path: "/actividades",
      },
      {
        label: submenuKeys.News,
        path: "/noticias",
      },
      {
        label: submenuKeys.Events,
        path: "/eventos",
      },
      {
        label: submenuKeys.Tags,
        path: "/etiquetas",
      },
    ],
  },
  {
    page: menuKeys.Management,
    path: "/gestion",
    icon: <FontAwesomeIcon icon={faTableList} />,
    role: [Role.administrator, Role.communicator],
    child: [
      {
        label: submenuKeys.PushNotifications,
        path: "/notificaciones",
      },
      {
        label: submenuKeys.AppTexts,
        path: "/traducciones",
      },
    ],
  },
  {
    page: menuKeys.Personal,
    path: "/personal",
    icon: <FontAwesomeIcon icon={faUsers} />,
    role: [Role.administrator],
    child: [
      {
        label: submenuKeys.Users,
        path: "/usuarios",
      },
    ],
  },
  {
    page: menuKeys.Settings,
    path: "/ajustes",
    icon: <FontAwesomeIcon icon={faGear} />,
    child: [
      {
        label: submenuKeys.Account,
        path: "/cuenta",
      },
    ],
  },
];
