/**
 * @description Endpoints exposed by horizon-sever, the api routes them in camelCase
 */
export enum Tables {
  Buildings = "buildings",
  BuildingCosts = "buildingCosts",
  BuildingProduces = "buildingProduces",
  BuildingReqBuildings = "buildingReqBuildings",
  BuildingReqTechs = "buildingReqTechs",
  BuildingTypes = "buildingTypes",
  BuildingUpkeeps = "buildingUpkeeps",
  Cannons = "cannons",
  CannonCosts = "cannonCosts",
  CannonReqBuildings = "cannonReqBuildings",
  CannonReqTechs = "cannonReqTechs",
  PushNotifications = "pushNotification",
  Resources = "resources",
  Ships = "ships",
  ShipCosts = "shipCosts",
  ShipReqBuildings = "shipReqBuildings",
  ShipReqTechs = "shipReqTechs",
  ShipUpkeeps = "shipUpkeeps",
  Skills = "skills",
  Techs = "techs",
  TechCosts = "techCosts",
  TechProduces = "techProduces",
  TechReqBuildings = "techReqBuildings",
  TechReqTechs = "techReqTechs",
  TechTypes = "techTypes",
  Users = "horizonUser",
}

export enum EntityName {
  Building = "building",
  BuildingCost = "buildingCost",
  BuildingProduce = "buildingProduce",
  BuildingReqBuilding = "buildingReqBuilding",
  BuildingReqTech = "buildingReqTech",
  BuildingType = "buildingType",
  BuildingUpkeep = "buildingUpkeep",
  Cannon = "cannon",
  CannonCost = "cannonCost",
  CannonReqBuilding = "cannonReqBuilding",
  CannonReqTech = "cannonReqTech",
  PushNotification = "pushNotification",
  Resource = "resource",
  Ship = "ship",
  ShipCost = "shipCost",
  ShipReqBuilding = "shipReqBuilding",
  ShipReqTech = "shipReqTech",
  ShipUpkeep = "shipUpkeep",
  Skill = "skill",
  Tech = "tech",
  TechCost = "techCost",
  TechProduce = "techProduce",
  TechReqBuilding = "techReqBuilding",
  TechReqTech = "techReqTech",
  TechType = "techType",
  User = "user",
}

export type APIError = {
  kind: string;
  message: string;
};
