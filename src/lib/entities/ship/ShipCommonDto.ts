import { ShipDto } from "./ShipDto";

export type ShipCommonDto = Omit<
  ShipDto,
  | "deleted"
  | "createdAt"
  | "urlName"
  | "description"
  | "creationTime"
  | "hull"
  | "knots"
  | "minCrew"
  | "bestCrew"
  | "maxCrew"
>;
