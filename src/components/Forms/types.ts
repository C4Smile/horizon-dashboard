import { EditorState } from "react-draft-wysiwyg";

export type HtmlInputPropsType = {
  label?: string;
  value?: EditorState;
  onChange: (e: EditorState) => void;
  wrapperClassName?: string;
};
