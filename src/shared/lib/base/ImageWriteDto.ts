import { BlobDto } from "lib";

/**
 * How an image travels when writing an entity: a photo the user just picked
 * goes as a blob and the server creates it, one that was already stored goes
 * as its id. parseImage produces exactly one of the two.
 */
export type ImageWriteDto =
  | { image: BlobDto; imageId?: never }
  | { imageId: number; image?: never };
