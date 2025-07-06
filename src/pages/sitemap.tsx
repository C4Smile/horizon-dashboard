import { Roles } from "lib";

// layouts
import { Auth, Dashboard, ModelNavigation } from "layouts";

// pages
// auth
import SignOut from "./Auth/SignOut.jsx";
import SignIn from "./Auth/SignIn.jsx";
import Recovery from "./Auth/Recovery.jsx";
import UpdatePassword from "./Auth/UpdatePassword.jsx";
// dashboard
import Home from "./Home.jsx";
import Account from "./Account/Account.jsx";
// game
// ships
import ShipsPage from "./Ships/Ships.jsx";
import ShipForm from "./Ships/ShipForm.jsx";
// cannons
import CannonsPage from "./Cannons/Cannons.jsx";
import CannonForm from "./Cannons/CannonForm.jsx";
// skills
import SkillsPage from "./Skills/Skills.jsx";
import SkillForm from "./Skills/SkillForm.jsx";
// buildings
import BuildingsPage from "./Buildings/Buildings.jsx";
import BuildingForm from "./Buildings/BuildingForm.jsx";
// buildingTypes
import BuildingTypesPage from "./BuildingTypes/BuildingTypes.jsx";
import BuildingTypeForm from "./BuildingTypes/BuildingTypeForm.jsx";
// resources
import ResourcesPage from "./Resources/Resources.jsx";
import ResourceForm from "./Resources/ResourceForm.jsx";
// techs
import TechsPage from "./Techs/Techs.jsx";
import TechForm from "./Techs/TechForm.jsx";
// techTypes
import TechTypesPage from "./TechTypes/TechTypes.jsx";
import TechTypeForm from "./TechTypes/TechTypeForm.jsx";
// players
import UsersPage from "./Users/Users.jsx";
import UserForm from "./Users/UserForm.jsx";

export const pageId = {
  auth: "auth",
  signOut: "signOut",
  signIn: "signIn",
  recovery: "recover",
  updatePassword: "updatePassword",
  dashboard: "dashboard",
  home: "home",
  settings: "settings",
  // game
  // ships
  ships: "ships",
  shipsNew: "shipsNew",
  shipsEdit: "shipsEdit",
  // cannons
  cannons: "cannons",
  cannonsNew: "cannonsNew",
  cannonsEdit: "cannonsEdit",
  // skills
  skills: "skills",
  skillsNew: "skillsNew",
  skillsEdit: "skillsEdit",
  // buildings
  buildings: "buildings",
  buildingsNew: "buildingsNew",
  buildingsEdit: "buildingsEdit",
  // buildingTypes
  buildingTypes: "buildingTypes",
  buildingTypesNew: "buildingTypesNew",
  buildingTypesEdit: "buildingTypesEdit",
  // resources
  resources: "resources",
  resourcesNew: "resourcesNew",
  resourcesEdit: "resourcesEdit",
  // techs
  techs: "techs",
  techsNew: "techsNew",
  techsEdit: "techsEdit",
  // tech types
  techTypes: "techTypes",
  techTypesNew: "techTypesNew",
  techTypesEdit: "techTypesEdit",
  // players
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
        path: "/recover",
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
      {
        key: pageId.settings,
        path: "/settings/account",
        component: <Account />,
      },
      // game
      {
        key: pageId.ships,
        path: "/game/ships",
        component: <ModelNavigation pageKey={pageId.ships} />,
        role: [Roles.administrator],
        children: [
          { key: pageId.ships, path: "/", component: <ShipsPage /> },
          { key: pageId.shipsNew, path: "/new", component: <ShipForm /> },
          { key: pageId.shipsEdit, path: "/:id", component: <ShipForm /> },
        ],
      },
      {
        key: pageId.cannons,
        path: "/game/cannons",
        component: <ModelNavigation pageKey={pageId.cannons} />,
        role: [Roles.administrator],
        children: [
          { key: pageId.cannons, path: "/", component: <CannonsPage /> },
          { key: pageId.cannonsNew, path: "/new", component: <CannonForm /> },
          { key: pageId.cannonsEdit, path: "/:id", component: <CannonForm /> },
        ],
      },
      {
        key: pageId.skills,
        path: "/game/skills",
        component: <ModelNavigation pageKey={pageId.skills} />,
        role: [Roles.administrator],
        children: [
          { key: pageId.skills, path: "/", component: <SkillsPage /> },
          { key: pageId.skillsNew, path: "/new", component: <SkillForm /> },
          { key: pageId.skillsEdit, path: "/:id", component: <SkillForm /> },
        ],
      },
      {
        key: pageId.buildings,
        path: "/game/buildings",
        component: <ModelNavigation pageKey={pageId.buildings} />,
        role: [Roles.administrator],
        children: [
          { key: pageId.buildings, path: "/", component: <BuildingsPage /> },
          {
            key: pageId.buildingsNew,
            path: "/new",
            component: <BuildingForm />,
          },
          {
            key: pageId.buildingsEdit,
            path: "/:id",
            component: <BuildingForm />,
          },
        ],
      },
      {
        key: pageId.buildingTypes,
        path: "/game/building-types",
        component: <ModelNavigation pageKey={pageId.buildingTypes} />,
        role: [Roles.administrator],
        children: [
          {
            key: pageId.buildingTypes,
            path: "/",
            component: <BuildingTypesPage />,
          },
          {
            key: pageId.buildingTypesNew,
            path: "/new",
            component: <BuildingTypeForm />,
          },
          {
            key: pageId.buildingTypesEdit,
            path: "/:id",
            component: <BuildingTypeForm />,
          },
        ],
      },
      {
        key: pageId.resources,
        path: "/game/resources",
        component: <ModelNavigation pageKey={pageId.resources} />,
        role: [Roles.administrator],
        children: [
          { key: pageId.resources, path: "/", component: <ResourcesPage /> },
          {
            key: pageId.resourcesNew,
            path: "/new",
            component: <ResourceForm />,
          },
          {
            key: pageId.resourcesEdit,
            path: "/:id",
            component: <ResourceForm />,
          },
        ],
      },
      {
        key: pageId.techTypes,
        path: "/game/tech-types",
        component: <ModelNavigation pageKey={pageId.techTypes} />,
        role: [Roles.administrator],
        children: [
          { key: pageId.techTypes, path: "/", component: <TechTypesPage /> },
          {
            key: pageId.techTypesNew,
            path: "/new",
            component: <TechTypeForm />,
          },
          {
            key: pageId.techTypesEdit,
            path: "/:id",
            component: <TechTypeForm />,
          },
        ],
      },
      {
        key: pageId.techs,
        path: "/game/techs",
        component: <ModelNavigation pageKey={pageId.techs} />,
        role: [Roles.administrator],
        children: [
          { key: pageId.techs, path: "/", component: <TechsPage /> },
          { key: pageId.techsNew, path: "/new", component: <TechForm /> },
          { key: pageId.techsEdit, path: "/:id", component: <TechForm /> },
        ],
      },
      // players
      {
        key: pageId.users,
        path: "/players/users",
        role: [Roles.administrator],
        component: <ModelNavigation pageKey={pageId.users} />,
        children: [
          { key: pageId.users, path: "/", component: <UsersPage /> },
          { key: pageId.usersNew, path: "/new", component: <UserForm /> },
          { key: pageId.usersEdit, path: "/:id", component: <UserForm /> },
        ],
      },
    ],
  },
  {
    key: pageId.signOut,
    component: <SignOut />,
    path: "/sign-out",
  },
];

/**
 *
 * @param {*} targetPageId target page
 * @param {*} basePage parent page
 * @param {*} currentPath current path
 * @returns path
 */
export const findPathInChildren = (
  targetPageId,
  basePage,
  currentPath = ""
) => {
  let path = "";
  for (let i = 0; i < basePage.children.length; ++i) {
    const page = basePage.children[i];
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
 * @param {*} targetPageId target page
 * @returns complete bath
 */
export const findPath = (targetPageId) => {
  let path = "";
  for (let i = 0; i < sitemap.length; i++) {
    const page = sitemap[i];
    if (page.key === targetPageId) return page.path;
    if (page.children) {
      path = findPathInChildren(
        targetPageId,
        page,
        page.path === "/" ? "" : page.path
      );
      if (path) {
        break;
      }
    }
  }
  return path;
};
