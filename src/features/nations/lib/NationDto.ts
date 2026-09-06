import { BaseEntityDto, PhotoDto } from "lib";

/**
 * A nation a player can belong to. Not every one is playable: some are there
 * as a presence in the world rather than as a choice.
 */
export interface NationDto extends BaseEntityDto {
  name: string;
  image?: PhotoDto;
  icon?: PhotoDto;
  description: string;
  playable: boolean;
}
