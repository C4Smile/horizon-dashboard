export enum ReactQueryKeys {
  Roles = "roles",
  Buildings = "buildings",
  BuildingShips = "buildingShips",
  BuildingCosts = "buildingCosts",
  BuildingUpkeeps = "buildingUpkeeps",
  BuildingProduces = "buildingProduces",
  BuildingTypes = "buildingTypes",
  BuildingRequirements = "buildingReqTechs",
  Nations = "nations",
  Resources = "resources",
  Users = "users",
  Techs = "techs",
  TechCosts = "techCosts",
  TechProduces = "techProduces",
  TechTypes = "techTypes",
  TechRequirements = "techReqTechs",
  Skills = "skills",
  Ships = "ships",
  ShipCosts = "shipCosts",
  ShipUpkeeps = "shipUpkeeps",
  ShipRequirements = "shipRequirements",
  Cannons = "cannons",
  CannonCosts = "cannonCosts",
  CannonRequirements = "cannonRequirements",
}

export const entities = ["building"];

export enum Parents {
  game = "game",
  user = "players",
}
