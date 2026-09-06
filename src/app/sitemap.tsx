import { Roles } from "lib";

// layouts
import { Auth, Dashboard, ModelNavigation } from "layouts";

// pages
// auth
import SignOut from "./views/Auth/SignOut";
import SignIn from "./views/Auth/SignIn";
import Recovery from "./views/Auth/Recovery";
import UpdatePassword from "./views/Auth/UpdatePassword";
// dashboard
import Home from "./views/Home";
import Account from "./views/Account/Account";
import SecuritySettings from "./views/Account/SecuritySettings";
import { SectionIndex } from "./views/SectionIndex";

// menu
import { MenuKeys } from "./menuMap";
// game
// ships
import ShipsPage from "features/ships/pages/Ships";
import ShipForm from "features/ships/pages/ShipForm";
// cannons
import CannonsPage from "features/cannons/pages/Cannons";
import CannonForm from "features/cannons/pages/CannonForm";
// skills
import SkillsPage from "features/skills/pages/Skills";
import SkillForm from "features/skills/pages/SkillForm";
// buildings
import BuildingsPage from "features/buildings/pages/Buildings";
import BuildingForm from "features/buildings/pages/BuildingForm";
// buildingTypes
import BuildingTypesPage from "features/buildingTypes/pages/BuildingTypes";
import BuildingTypeForm from "features/buildingTypes/pages/BuildingTypeForm";
// resources
import ResourcesPage from "features/resources/pages/Resources";
import ResourceForm from "features/resources/pages/ResourceForm";
// techs
import TechsPage from "features/techs/pages/Techs";
import TechForm from "features/techs/pages/TechForm";
// techTypes
import TechTypesPage from "features/techTypes/pages/TechTypes";
import TechTypeForm from "features/techTypes/pages/TechTypeForm";
// players
import UsersPage from "features/users/pages/Users";
import UserForm from "features/users/pages/UserForm";

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
  // the landing page of a drawer group, listing what hangs off it
  game = "game",
  players = "players",
  settings = "settings",
  security = "security",
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
        path: "/settings",
        component: <SectionIndex page={MenuKeys.Settings} />,
      },
      {
        key: PageId.settings,
        path: "/settings/account",
        component: <Account />,
      },
      {
        key: PageId.security,
        path: "/settings/security",
        component: <SecuritySettings />,
      },
      {
        key: PageId.game,
        path: "/game",
        role: [Roles.administrator],
        component: <SectionIndex page={MenuKeys.Game} />,
      },
      {
        key: PageId.players,
        path: "/players",
        role: [Roles.administrator],
        component: <SectionIndex page={MenuKeys.Players} />,
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
      // returning currentPath + page.path here dropped the segment the match
      // was actually found at, so a grandchild resolved to its parent's route
      if (path) return path;
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

/**
 * Every model layout mounts its create form as a `New` child route, named
 * after the list it belongs to. The path used to be built from a translation
 * key that was never defined, so the insert link pointed at
 * /game/resources/labels.new and landed on the not found page.
 *
 * @param targetPageId list page of the model
 * @returns path of that model's create form
 */
export const findNewPath = (targetPageId: PageId) =>
  findPath(`${targetPageId}New` as PageId);
