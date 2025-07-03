import { BuildingTypeDto } from "./BuildingTypeDto";

export type BuildingTypeCommonDto = Omit<
  BuildingTypeDto,
  "deleted" | "createdAt"
>;
