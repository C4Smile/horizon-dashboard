import { BuildingDto } from "./BuildingDto";

export type BuildingCommonDto = Omit<
  BuildingDto,
  "deleted" | "createdAt" | "type" | "urlName" | "description" | "creationTime"
>;
