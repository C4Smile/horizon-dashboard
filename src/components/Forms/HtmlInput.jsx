import React, { forwardRef } from "react";
// rich editor
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const HtmlInput = forwardRef(function (props, ref) {
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
        editorRef={ref}
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

export default HtmlInput;
