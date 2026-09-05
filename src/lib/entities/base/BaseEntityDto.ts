import { DeleteDto } from "lib";

export interface BaseEntityDto extends DeleteDto {
  /** when the row was soft deleted, null while it is active */
  deletedAt?: Date | null;
  dateOfCreation: Date;
  lastUpdate: Date;
  lockedBy: number;
}
