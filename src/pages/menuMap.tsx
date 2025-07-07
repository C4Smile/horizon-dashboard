// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faGamepad,
  faGear,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

// lib
import { Roles } from "lib";

// types
import { MenuItemType } from "./types";

export enum MenuKeys {
  Dashboard = "dashboard",
  Game = "game",
  Players = "players",
  Settings = "settings",
}

export enum SubMenuKeys {
  Main = "main",
  // Game
  Ships = "ships",
  Cannons = "cannons",
  Skills = "skills",
  Buildings = "buildings",
  BuildingTypes = "buildingTypes",
  Resources = "resources",
  Techs = "techs",
  TechTypes = "techTypes",
  // players
  Users = "users",
  Account = "account",
}

export const menuMap: MenuItemType[] = [
  {
    page: MenuKeys.Dashboard,
    path: "/",
    icon: <FontAwesomeIcon icon={faChartLine} />,
    child: [{ label: SubMenuKeys.Main, path: "/" }],
  },
  {
    page: MenuKeys.Game,
    path: "/game",
    icon: <FontAwesomeIcon icon={faGamepad} />,
    roles: [Roles.administrator],
    child: [
      {
        label: SubMenuKeys.Ships,
        path: "/ships",
      },
      {
        label: SubMenuKeys.Cannons,
        path: "/cannons",
      },
      {
        label: SubMenuKeys.Skills,
        path: "/skills",
      },
      {
        label: SubMenuKeys.Buildings,
        path: "/buildings",
      },
      {
        label: SubMenuKeys.BuildingTypes,
        path: "/building-types",
      },
      {
        label: SubMenuKeys.Resources,
        path: "/resources",
      },
      {
        label: SubMenuKeys.Techs,
        path: "/techs",
      },
      {
        label: SubMenuKeys.TechTypes,
        path: "/tech-types",
      },
    ],
  },
  {
    page: MenuKeys.Players,
    path: "/players",
    icon: <FontAwesomeIcon icon={faUsers} />,
    roles: [Roles.administrator],
    child: [
      {
        label: SubMenuKeys.Users,
        path: "/users",
      },
    ],
  },
  {
    page: MenuKeys.Settings,
    path: "/settings",
    icon: <FontAwesomeIcon icon={faGear} />,
    child: [
      {
        label: SubMenuKeys.Account,
        path: "/account",
      },
    ],
  },
];
