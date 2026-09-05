import { BlobDto } from "../photo";

/**
 * How an icon travels when writing an entity. Same two shapes as
 * [ImageWriteDto], plus neither: the icon is optional, and an entity without
 * one sends nothing so iconId stays null.
 */
export type IconWriteDto = Partial<{ icon: BlobDto; iconId: number }>;
