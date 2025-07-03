import { ResourceDto } from "./ResourceDto";

export type ResourceCommonDto = Omit<
  ResourceDto,
  "deleted" | "createdAt" | "urlName" | "description" | "baseFactor"
>;
