import { TechProduceDto } from "./TechProduceDto";

/**
 * What the api takes to create the relation. The owning entity travels in
 * the url and the joined record is read side only.
 */
export type TechProduceAddDto = Omit<
  TechProduceDto,
  "id" | "resource" | "techId"
>;
