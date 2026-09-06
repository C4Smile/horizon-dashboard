import { DeleteDto } from "lib";

export interface BaseEntityDto extends DeleteDto {
  /**
   * The api serialises these as iso strings, but the shared library's
   * BaseEntityDto constraint declares them Date and this dto has to satisfy
   * it. Nothing reads them as Date: the columns render through String() and
   * the forms keep their own string copy.
   */
  /** when the row was soft deleted, null while it is active */
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lockedBy: number;
}
