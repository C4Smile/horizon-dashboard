import { DeleteDto } from "lib";

export interface BaseEntityDto extends DeleteDto {
  /** when the row was soft deleted, null while it is active */
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lockedBy: number;
}
