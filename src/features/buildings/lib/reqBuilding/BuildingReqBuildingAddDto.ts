import { BuildingReqBuildingDto } from "./BuildingReqBuildingDto";

/**
 * What the api takes to create the relation. The owning entity travels in
 * the url and the joined record is read side only.
 */
export type BuildingReqBuildingAddDto = Omit<
  BuildingReqBuildingDto,
  "id" | "buildingId"
>;
