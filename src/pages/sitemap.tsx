import { Roles } from "lib";

// layouts
import { Auth, Dashboard, ModelNavigation } from "layouts";

// pages
// auth
import SignOut from "./Auth/SignOut";
import SignIn from "./Auth/SignIn";
import Recovery from "./Auth/Recovery";
import UpdatePassword from "./Auth/UpdatePassword";
// dashboard
import Home from "./Home";
import Account from "./Account/Account";
// game
// ships
import ShipsPage from "./Ships/Ships";
import ShipForm from "./Ships/ShipForm";
// cannons
import CannonsPage from "./Cannons/Cannons";
import CannonForm from "./Cannons/CannonForm";
// skills
import SkillsPage from "./Skills/Skills";
import SkillForm from "./Skills/SkillForm";
// buildings
import BuildingsPage from "./Buildings/Buildings";
import BuildingForm from "./Buildings/BuildingForm";
// buildingTypes
import BuildingTypesPage from "./BuildingTypes/BuildingTypes";
import BuildingTypeForm from "./BuildingTypes/BuildingTypeForm";
// resources
import ResourcesPage from "./Resources/Resources";
import ResourceForm from "./Resources/ResourceForm";
// techs
import TechsPage from "./Techs/Techs";
import TechForm from "./Techs/TechForm";
// techTypes
import TechTypesPage from "./TechTypes/TechTypes";
import TechTypeForm from "./TechTypes/TechTypeForm";
// players
import UsersPage from "./Users/Users";
import UserForm from "./Users/UserForm";

// types
import { ViewPageType } from "./types.js";

export enum PageId {
  auth = "auth",
  signOut = "signOut",
  signIn = "signIn",
  recovery = "recover",
  updatePassword = "updatePassword",
  dashboard = "dashboard",
  home = "home",
  settings = "settings",
  // game
  // ships
  ships = "ships",
  shipsNew = "shipsNew",
  shipsEdit = "shipsEdit",
  // cannons
  cannons = "cannons",
  cannonsNew = "cannonsNew",
  cannonsEdit = "cannonsEdit",
  // skills
  skills = "skills",
  skillsNew = "skillsNew",
  skillsEdit = "skillsEdit",
  // buildings
  buildings = "buildings",
  buildingsNew = "buildingsNew",
  buildingsEdit = "buildingsEdit",
  // buildingTypes
  buildingTypes = "buildingTypes",
  buildingTypesNew = "buildingTypesNew",
  buildingTypesEdit = "buildingTypesEdit",
  // resources
  resources = "resources",
  resourcesNew = "resourcesNew",
  resourcesEdit = "resourcesEdit",
  // techs
  techs = "techs",
  techsNew = "techsNew",
  techsEdit = "techsEdit",
  // tech types
  techTypes = "techTypes",
  techTypesNew = "techTypesNew",
  techTypesEdit = "techTypesEdit",
  // players
  users = "users",
  usersNew = "usersNew",
  usersEdit = "usersEdit",
}

export const sitemap: ViewPageType[] = [
  {
    key: PageId.auth,
    component: <Auth />,
    path: "/auth",
    children: [
      {
        key: PageId.signIn,
        path: "/",
        component: <SignIn />,
      },
      {
        key: PageId.recovery,
        path: "/recover",
        component: <Recovery />,
      },
      {
        key: PageId.updatePassword,
        path: "/update-password",
        component: <UpdatePassword />,
      },
    ],
  },
  {
    key: PageId.dashboard,
    path: "/",
    component: <Dashboard />,
    children: [
      { key: PageId.home, path: "/", component: <Home /> },
      {
        key: PageId.settings,
        path: "/settings/account",
        component: <Account />,
      },
      // game
      {
        key: PageId.ships,
        path: "/game/ships",
        component: <ModelNavigation pageKey={PageId.ships} />,
        role: [Roles.administrator],
        children: [
          { key: PageId.ships, path: "/", component: <ShipsPage /> },
          { key: PageId.shipsNew, path: "/new", component: <ShipForm /> },
          { key: PageId.shipsEdit, path: "/:id", component: <ShipForm /> },
        ],
      },
      {
        key: PageId.cannons,
        path: "/game/cannons",
        component: <ModelNavigation pageKey={PageId.cannons} />,
        role: [Roles.administrator],
        children: [
          { key: PageId.cannons, path: "/", component: <CannonsPage /> },
          { key: PageId.cannonsNew, path: "/new", component: <CannonForm /> },
          { key: PageId.cannonsEdit, path: "/:id", component: <CannonForm /> },
        ],
      },
      {
        key: PageId.skills,
        path: "/game/skills",
        component: <ModelNavigation pageKey={PageId.skills} />,
        role: [Roles.administrator],
        children: [
          { key: PageId.skills, path: "/", component: <SkillsPage /> },
          { key: PageId.skillsNew, path: "/new", component: <SkillForm /> },
          { key: PageId.skillsEdit, path: "/:id", component: <SkillForm /> },
        ],
      },
      {
        key: PageId.buildings,
        path: "/game/buildings",
        component: <ModelNavigation pageKey={PageId.buildings} />,
        role: [Roles.administrator],
        children: [
          { key: PageId.buildings, path: "/", component: <BuildingsPage /> },
          {
            key: PageId.buildingsNew,
            path: "/new",
            component: <BuildingForm />,
          },
          {
            key: PageId.buildingsEdit,
            path: "/:id",
            component: <BuildingForm />,
          },
        ],
      },
      {
        key: PageId.buildingTypes,
        path: "/game/building-types",
        component: <ModelNavigation pageKey={PageId.buildingTypes} />,
        role: [Roles.administrator],
        children: [
          {
            key: PageId.buildingTypes,
            path: "/",
            component: <BuildingTypesPage />,
          },
          {
            key: PageId.buildingTypesNew,
            path: "/new",
            component: <BuildingTypeForm />,
          },
          {
            key: PageId.buildingTypesEdit,
            path: "/:id",
            component: <BuildingTypeForm />,
          },
        ],
      },
      {
        key: PageId.resources,
        path: "/game/resources",
        component: <ModelNavigation pageKey={PageId.resources} />,
        role: [Roles.administrator],
        children: [
          { key: PageId.resources, path: "/", component: <ResourcesPage /> },
          {
            key: PageId.resourcesNew,
            path: "/new",
            component: <ResourceForm />,
          },
          {
            key: PageId.resourcesEdit,
            path: "/:id",
            component: <ResourceForm />,
          },
        ],
      },
      {
        key: PageId.techTypes,
        path: "/game/tech-types",
        component: <ModelNavigation pageKey={PageId.techTypes} />,
        role: [Roles.administrator],
        children: [
          { key: PageId.techTypes, path: "/", component: <TechTypesPage /> },
          {
            key: PageId.techTypesNew,
            path: "/new",
            component: <TechTypeForm />,
          },
          {
            key: PageId.techTypesEdit,
            path: "/:id",
            component: <TechTypeForm />,
          },
        ],
      },
      {
        key: PageId.techs,
        path: "/game/techs",
        component: <ModelNavigation pageKey={PageId.techs} />,
        role: [Roles.administrator],
        children: [
          { key: PageId.techs, path: "/", component: <TechsPage /> },
          { key: PageId.techsNew, path: "/new", component: <TechForm /> },
          { key: PageId.techsEdit, path: "/:id", component: <TechForm /> },
        ],
      },
      // players
      {
        key: PageId.users,
        path: "/players/users",
        role: [Roles.administrator],
        component: <ModelNavigation pageKey={PageId.users} />,
        children: [
          { key: PageId.users, path: "/", component: <UsersPage /> },
          { key: PageId.usersNew, path: "/new", component: <UserForm /> },
          { key: PageId.usersEdit, path: "/:id", component: <UserForm /> },
        ],
      },
    ],
  },
  {
    key: PageId.signOut,
    component: <SignOut />,
    path: "/sign-out",
  },
];

/**
 *
 * @param targetPageId target page
 * @param basePage parent page
 * @param currentPath current path
 * @returns path
 */
export const findPathInChildren = (
  targetPageId: PageId,
  basePage: ViewPageType,
  currentPath = "",
) => {
  let path = "";
  const baseChildren = basePage.children ?? [];
  for (let i = 0; i < baseChildren.length; ++i) {
    const page = baseChildren[i];
    if (page.key === targetPageId) return (path = `${currentPath}${page.path}`);

    if (page.children) {
      path = findPathInChildren(targetPageId, page, currentPath + page.path);
      if (path) return currentPath + page.path;
    }
  }
  return path;
};

/**
 *
 * @param targetPageId target page
 * @returns complete bath
 */
export const findPath = (targetPageId: PageId) => {
  let path = "";
  for (let i = 0; i < sitemap.length; i++) {
    const page = sitemap[i];
    if (page.key === targetPageId) return page.path;
    if (page.children) {
      path = findPathInChildren(
        targetPageId,
        page,
        page.path === "/" ? "" : page.path,
      );
      if (path) {
        break;
      }
    }
  }
  return path;
};
