export enum TechTabs {
  General,
  Produces,
  Costs,
  TechReqTechs,
  TechReqBuildings,
}

export const techTabs = [
  { id: "general" },
  { id: "produces", hide: (condition: boolean) => condition },
  { id: "costs", hide: (condition: boolean) => condition },
  { id: "techReqTechs", hide: (condition: boolean) => condition },
  { id: "techReqBuildings", hide: (condition: boolean) => condition },
];
