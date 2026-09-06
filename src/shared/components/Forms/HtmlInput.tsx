import { forwardRef } from "react";
// rich editor
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// types
import { HtmlInputPropsType } from "./types";

// utils
import { toEditorState } from "utils";

export const HtmlInput = forwardRef(function (
  props: HtmlInputPropsType,
  ref: unknown,
) {
  const { label, value, onChange, wrapperClassName } = props;

  // html on the way in, draft state once parsed; the editor only takes the latter
  const editorState = (
    typeof value === "string" ? toEditorState(value) : value
  ) as EditorState | undefined;

  return (
    <div className="segoe w-full mb-5">
      <label className="mt-5 mb-2 poppins">{label}</label>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName={`wrapperClassName ${wrapperClassName}`}
        editorClassName="editorClassName !h-60 !bg-base-light !text-fg p-5"
        onEditorStateChange={onChange}
        editorRef={ref as (ref: object) => void}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "list",
            "textAlign",
            "link",
            "emoji",
            "image",
            "history",
          ],
        }}
      />
    </div>
  );
});
