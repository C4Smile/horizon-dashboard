import { BaseEntityDto } from "lib";

/**
 * A tech type is only a name. Nothing draws a picture for one: the game never
 * asks for it and this table lists them by name.
 */
export interface TechTypeDto extends BaseEntityDto {
  name: string;
}
