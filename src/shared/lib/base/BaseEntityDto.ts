import { DeleteDto } from "lib";

export interface BaseEntityDto extends DeleteDto {
  /**
   * The three timestamps travel as the ISO strings the api serialises, not as
   * Date. Nothing parses them on the way in.
   */
  /** when the row was soft deleted, null while it is active */
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  lockedBy: number;
}
