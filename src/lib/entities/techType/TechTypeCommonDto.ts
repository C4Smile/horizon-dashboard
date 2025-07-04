import { TechTypeDto } from "./TechTypeDto";

export type TechTypeCommonDto = Omit<
  TechTypeDto,
  "deleted" | "createdAt"
>;
