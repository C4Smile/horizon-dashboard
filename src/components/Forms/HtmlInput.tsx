import { forwardRef } from "react";
// rich editor
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// types
import { HtmlInputPropsType } from "./types";

export const HtmlInput = forwardRef(function (
  props: HtmlInputPropsType,
  ref: unknown,
) {
  const { label, value, onChange, wrapperClassName } = props;

  return (
    <div className="segoe w-full mb-5">
      <label className="mt-5 mb-2 poppins">{label}</label>
      <Editor
        editorState={value}
        toolbarClassName="toolbarClassName"
        wrapperClassName={`wrapperClassName ${wrapperClassName}`}
        editorClassName="editorClassName !h-60 !bg-white p-5"
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
