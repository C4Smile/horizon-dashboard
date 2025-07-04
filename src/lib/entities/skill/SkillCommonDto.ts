import { SkillDto } from "./SkillDto";

export type SkillCommonDto = Omit<
  SkillDto,
  "deleted" | "createdAt" | "urlName" | "description" | "baseFactor"
>;
