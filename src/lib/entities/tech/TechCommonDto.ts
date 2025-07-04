import { TechDto } from "./TechDto";

export type TechCommonDto = Omit<
  TechDto,
  "deleted" | "createdAt" | "type" | "urlName" | "description" | "creationTime"
>;
