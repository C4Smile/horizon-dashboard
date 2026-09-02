// @sito/dashboard-app
import type {
  MenuItemType,
  SessionAccountDto,
  TFunction,
} from "@sito/dashboard-app";

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
import { HorizonAccountType } from "providers";

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

/**
 * @param account - current session
 * @returns whether the session belongs to an administrator
 */
const isAdmin = (account?: SessionAccountDto) =>
  (account as HorizonAccountType | undefined)?.horizonUser?.roleId ===
  Roles.administrator;

type SubMenuDefinition = {
  key: SubMenuKeys;
  path: string;
};

/**
 * Builds a drawer entry, resolving child labels and absolute paths the shared
 * Drawer renders as they come
 * @param page - menu group key
 * @param path - group base path
 * @param icon - group icon
 * @param children - child definitions relative to the group path
 * @param t - translation function
 * @param access - optional access guard for the whole group
 * @returns menu entry
 */
const buildMenuItem = (
  page: MenuKeys,
  path: string,
  icon: React.ReactNode,
  children: SubMenuDefinition[],
  t: TFunction,
  access?: (account?: SessionAccountDto) => boolean,
): MenuItemType<MenuKeys> => ({
  page,
  path,
  icon,
  access,
  children: children.map((child) => ({
    id: child.key,
    label: t(`_pages:${page}.links.${child.key}`),
    path: `${path !== "/" ? path : ""}${child.path}`,
  })),
});

/**
 * @param t - translation function
 * @returns the drawer menu for the current language
 */
export const getMenuMap = (t: TFunction): MenuItemType<MenuKeys>[] => [
  buildMenuItem(
    MenuKeys.Dashboard,
    "/",
    <FontAwesomeIcon icon={faChartLine} />,
    [{ key: SubMenuKeys.Main, path: "/" }],
    t,
  ),
  buildMenuItem(
    MenuKeys.Game,
    "/game",
    <FontAwesomeIcon icon={faGamepad} />,
    [
      { key: SubMenuKeys.Ships, path: "/ships" },
      { key: SubMenuKeys.Cannons, path: "/cannons" },
      { key: SubMenuKeys.Skills, path: "/skills" },
      { key: SubMenuKeys.Buildings, path: "/buildings" },
      { key: SubMenuKeys.BuildingTypes, path: "/building-types" },
      { key: SubMenuKeys.Resources, path: "/resources" },
      { key: SubMenuKeys.Techs, path: "/techs" },
      { key: SubMenuKeys.TechTypes, path: "/tech-types" },
    ],
    t,
    isAdmin,
  ),
  buildMenuItem(
    MenuKeys.Players,
    "/players",
    <FontAwesomeIcon icon={faUsers} />,
    [{ key: SubMenuKeys.Users, path: "/users" }],
    t,
    isAdmin,
  ),
  buildMenuItem(
    MenuKeys.Settings,
    "/settings",
    <FontAwesomeIcon icon={faGear} />,
    [{ key: SubMenuKeys.Account, path: "/account" }],
    t,
  ),
];
