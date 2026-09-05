import htmlToDraftjs from "html-to-draftjs";
import { ContentState, EditorState } from "draft-js";

type HtmlToDraft = typeof htmlToDraftjs;

/**
 * html-to-draftjs ships an umd webpack bundle that flags itself as an es module,
 * depending on the interop the callable lands either on the module or on its default
 */
export const htmlToDraft: HtmlToDraft =
  (htmlToDraftjs as unknown as { default?: HtmlToDraft }).default ??
  htmlToDraftjs;

/**
 * Turns the html the api stores into the state the rich text input edits.
 * Anything that is not a non-empty html string is handed back untouched, so
 * an already parsed EditorState survives a second pass.
 * @param value - description as it came from the api
 * @returns editor state, or the original value when there is nothing to parse
 */
export function toEditorState<TValue>(value: TValue): TValue | EditorState {
  if (typeof value !== "string" || !value) return value;

  const blocks = htmlToDraft(value);
  if (!blocks) return value;

  return EditorState.createWithContent(
    ContentState.createFromBlockArray(blocks.contentBlocks),
  );
}
