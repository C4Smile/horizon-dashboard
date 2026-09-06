import { BaseEntityDto } from "lib";

/**
 * A building type is only a name. Nothing draws a picture for one: the game
 * renders its type tabs as text and this table lists them by name.
 */
export interface BuildingTypeDto extends BaseEntityDto {
  name: string;
}
