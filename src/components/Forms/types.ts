import { EditorState } from "react-draft-wysiwyg";

export type HtmlInputPropsType = {
  label?: string;
  /**
   * The form holds html while it loads and draft state once the user touches
   * it, so both arrive here and the editor gets the parsed one.
   */
  value?: string | EditorState;
  onChange: (e: EditorState) => void;
  wrapperClassName?: string;
};
