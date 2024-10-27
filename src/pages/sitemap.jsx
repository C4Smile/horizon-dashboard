import { Role } from "../api/RoleApiClient";

// layouts
import Auth from "../layouts/Auth";
import Dashboard from "../layouts/Dashboard";
import ModelNavigation from "../layouts/ModelNavigation";

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
// buildings
import BuildingsPage from "./Buildings/Buildings";
import BuildingForm from "./Buildings/BuildingForm";
// resources
import ResourcesPage from "./Resources/Resources";
import ResourceForm from "./Resources/ResourceForm";
// players
import UsersPage from "./Users/Users";
import UserForm from "./Users/UserForm";

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
  buildings: "buildings",
  buildingsNew: "buildingsNew",
  buildingsEdit: "buildingsEdit",
  resources: "resources",
  resourcesNew: "resourcesNew",
  resourcesEdit: "resourcesEdit",
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
      { key: pageId.settings, path: "/settings/account", component: <Account /> },
      // game
      {
        key: pageId.buildings,
        path: "/game/buildings",
        component: <ModelNavigation parent="game" model="buildings" />,
        role: [Role.administrator],
        children: [
          { key: pageId.buildings, path: "/", component: <BuildingsPage /> },
          { key: pageId.buildingsNew, path: "/new", component: <BuildingForm /> },
          { key: pageId.buildingsEdit, path: "/:id", component: <BuildingForm /> },
        ],
      },
      {
        key: pageId.resources,
        path: "/game/resources",
        component: <ModelNavigation parent="game" model="resources" />,
        role: [Role.administrator],
        children: [
          { key: pageId.resources, path: "/", component: <ResourcesPage /> },
          { key: pageId.resourcesNew, path: "/new", component: <ResourceForm /> },
          { key: pageId.resourcesEdit, path: "/:id", component: <ResourceForm /> },
        ],
      },
      // players
      {
        key: pageId.users,
        path: "/players/users",
        role: [Role.administrator],
        component: <ModelNavigation parent="players" model="users" />,
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
export const findPathInChildren = (targetPageId, basePage, currentPath = "") => {
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
      path = findPathInChildren(targetPageId, page, page.path);
      if (path) {
        break;
      }
    }
  }
  return path;
};
