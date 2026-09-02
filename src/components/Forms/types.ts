import { TextInputPropsType } from "@sito/dashboard-app";
import { DetailedHTMLProps, TextareaHTMLAttributes } from "react";
import { EditorState } from "react-draft-wysiwyg";

export type HtmlInputPropsType = {
  label?: string;
  value?: EditorState;
  onChange: (e: EditorState) => void;
  wrapperClassName?: string;
};

export interface ParagraphInputPropsType
  extends
    Pick<
      TextInputPropsType,
      | "label"
      | "state"
      | "containerClassName"
      | "inputClassName"
      | "labelClassName"
      | "helperText"
      | "helperTextClassName"
    >,
    DetailedHTMLProps<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    > {}
