import { Role } from "../api/RoleApiClient";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faChartLine,
  faGear,
  faRss,
  faTableList,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export const menuKeys = {
  Dashboard: "dashboard",
  Museum: "museum",
  Information: "information",
  Management: "management",
  Personal: "personal",
  Settings: "settings",
};

export const submenuKeys = {
  Main: "main",
  Services: "services",
  Rooms: "rooms",
  RoomAreas: "roomAreas",
  SortRooms: "sortRooms",
  RoomTypes: "roomTypes",
  GuestBooks: "guestBooks",
  Activities: "activities",
  News: "news",
  Events: "events",
  Tags: "tags",
  PushNotifications: "pushNotifications",
  AppTexts: "appTexts",
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
    page: menuKeys.Museum,
    path: "/museum",
    icon: <FontAwesomeIcon icon={faBuildingColumns} />,
    role: [Role.administrator, Role.museologist],
    child: [
      {
        label: submenuKeys.Services,
        path: "/services",
      },
      {
        label: submenuKeys.Rooms,
        path: "/rooms",
      },
      {
        label: submenuKeys.RoomAreas,
        path: "/roomAreas",
      },
      {
        label: submenuKeys.SortRooms,
        path: "/sortRooms",
      },
      {
        label: submenuKeys.RoomTypes,
        path: "/roomTypes",
      },
      {
        label: submenuKeys.GuestBooks,
        path: "/guestBooks",
      },
    ],
  },
  {
    page: menuKeys.Information,
    path: "/information",
    icon: <FontAwesomeIcon icon={faRss} />,
    role: [Role.administrator, Role.communicator],
    child: [
      {
        label: submenuKeys.Activities,
        path: "/activities",
      },
      {
        label: submenuKeys.News,
        path: "/news",
      },
      {
        label: submenuKeys.Events,
        path: "/events",
      },
      {
        label: submenuKeys.Tags,
        path: "/tags",
      },
    ],
  },
  {
    page: menuKeys.Management,
    path: "/management",
    icon: <FontAwesomeIcon icon={faTableList} />,
    role: [Role.administrator, Role.communicator],
    child: [
      {
        label: submenuKeys.PushNotifications,
        path: "/pushNotifications",
      },
      {
        label: submenuKeys.AppTexts,
        path: "/appTexts",
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
        path: "/users",
      },
    ],
  },
  {
    page: menuKeys.Settings,
    path: "/settings",
    icon: <FontAwesomeIcon icon={faGear} />,
    child: [
      {
        label: submenuKeys.Account,
        path: "/account",
      },
    ],
  },
];
