import draftToHtml from "draftjs-to-html";
import { convertToRaw, EditorState } from "draft-js";

// lib
import { BlobDto, PhotoDto } from "lib";

/** image seeded by scripts.sql, used when the entity has no photo */
export const DEFAULT_IMAGE_ID = 1;

export type FormPhoto = Partial<PhotoDto & BlobDto> | null | undefined;

/**
 * @description Converts what the HtmlInput holds into the html the api stores
 * @param value - draft-js state, or already parsed html
 * @returns html string
 */
export function parseHtml(value?: string | EditorState): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return draftToHtml(convertToRaw(value.getCurrentContent()));
}

/**
 * @description Text inputs always give strings back, the api wants numbers
 * @param value - form value
 * @returns number, 0 when it is not parseable
 */
export function parseNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * @description Select inputs give either the option or its id
 * @param value - form value
 * @returns entity id
 */
export function parseId(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "object")
    return parseNumber((value as { id?: number }).id);
  return parseNumber(value);
}

/**
 * @description Builds the image part of an Add/Update dto
 * a freshly uploaded photo travels as a blob, the server creates the image and links it,
 * an untouched photo travels as the id it already has
 * @param photo - ImageUploader state
 * @returns image or imageId, ready to be spread into the dto
 */
export function parseImage(photo: FormPhoto) {
  const blob = photo as BlobDto;
  if (blob?.base64)
    return {
      image: {
        base64: blob.base64,
        folder: blob.folder,
        fileName: blob.fileName,
        // images.alt is not nullable and the uploader does not ask for it
        alt: blob.fileName,
      },
    };

  const saved = photo as PhotoDto;
  if (saved?.id) return { imageId: saved.id };

  return { imageId: DEFAULT_IMAGE_ID };
}
