import { DeleteDto } from "lib";

export interface BaseEntityDto extends DeleteDto {
  deleted: boolean;
  dateOfCreation: Date;
  lastUpdate: Date;
  lockedBy: number;
}
