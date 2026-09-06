import type { EditorState } from "draft-js";

/**
 * A dto as a form holds it, which is not how the api answers it:
 *
 * - every field is optional, a form starts empty and fills in
 * - number fields may still be strings, that is what a text input hands back
 * - the description is edited as draft state until parseHtml turns it back
 *   into the html the api stores
 *
 * The clients take this on the way in and map it through toDto, which is
 * where parseNumber, parseId and parseHtml do the narrowing.
 */
export type FormValues<TDto> = {
  [K in keyof Omit<TDto, "description">]?: TDto[K] extends number
    ? number | string
    : TDto[K];
} & {
  description?: string | EditorState;
};
