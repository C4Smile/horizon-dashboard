import htmlToDraftjs from "html-to-draftjs";

type HtmlToDraft = typeof htmlToDraftjs;

/**
 * html-to-draftjs ships an umd webpack bundle that flags itself as an es module,
 * depending on the interop the callable lands either on the module or on its default
 */
export const htmlToDraft: HtmlToDraft =
  (htmlToDraftjs as unknown as { default?: HtmlToDraft }).default ??
  htmlToDraftjs;
