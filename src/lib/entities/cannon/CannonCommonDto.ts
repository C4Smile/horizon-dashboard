import { CannonDto } from "./CannonDto";

export type CannonCommonDto = Omit<
  CannonDto,
  "deleted" | "createdAt" | "type" | "urlName" | "description" | "creationTime"
>;
