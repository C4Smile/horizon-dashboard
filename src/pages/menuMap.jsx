import { Role } from "../api/RoleApiClient";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faGamepad, faGear, faUsers } from "@fortawesome/free-solid-svg-icons";

export const menuKeys = {
  Dashboard: "dashboard",
  Game: "game",
  Players: "players",
  Settings: "settings",
};

export const submenuKeys = {
  Main: "main",
  // Game
  Ships: "ships",
  Skills: "skills",
  Buildings: "buildings",
  BuildingTypes: "buildingTypes",
  Resources: "resources",
  Techs: "techs",
  TechTypes: "techTypes",
  // players
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
    page: menuKeys.Game,
    path: "/game",
    icon: <FontAwesomeIcon icon={faGamepad} />,
    role: [Role.administrator],
    child: [
      {
        label: submenuKeys.Ships,
        path: "/ships",
      },
      {
        label: submenuKeys.Skills,
        path: "/skills",
      },
      {
        label: submenuKeys.Buildings,
        path: "/buildings",
      },
      {
        label: submenuKeys.BuildingTypes,
        path: "/building-types",
      },
      {
        label: submenuKeys.Resources,
        path: "/resources",
      },
      {
        label: submenuKeys.Techs,
        path: "/techs",
      },
      {
        label: submenuKeys.TechTypes,
        path: "/tech-types",
      },
    ],
  },
  {
    page: menuKeys.Players,
    path: "/players",
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
