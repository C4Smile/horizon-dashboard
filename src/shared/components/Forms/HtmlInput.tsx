import { forwardRef, useMemo } from "react";
import { useTranslation } from "react-i18next";

// rich editor
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnUnderline,
  BtnUndo,
  createDropdown,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";

// types
import { HtmlInputPropsType } from "./types";

export const HtmlInput = forwardRef<HTMLDivElement, HtmlInputPropsType>(
  function HtmlInput(props, ref) {
    const { label, value, onChange, wrapperClassName, disabled, name } = props;

    const { t } = useTranslation();

    // the package ships this dropdown with english labels and a code block a
    // description has no use for, so it is rebuilt on the app's own copy
    const BtnStyles = useMemo(
      () =>
        createDropdown(t("_accessibility:components.editor.styles"), [
          [t("_accessibility:components.editor.normal"), "formatBlock", "P"],
          [t("_accessibility:components.editor.heading1"), "formatBlock", "H1"],
          [t("_accessibility:components.editor.heading2"), "formatBlock", "H2"],
          [t("_accessibility:components.editor.heading3"), "formatBlock", "H3"],
        ]),
      [t],
    );

    return (
      <div className={`segoe w-full mb-5 ${wrapperClassName ?? ""}`}>
        <label className="mt-5 mb-2 poppins">{label}</label>
        <EditorProvider>
          <Editor
            ref={ref}
            name={name}
            disabled={disabled}
            value={value ?? ""}
            // the api stores html and hands html back, so nothing is parsed on
            // the way in or out: what the editor holds is what gets saved
            onChange={(event) => onChange(event.target.value)}
          >
            <Toolbar>
              <BtnUndo />
              <BtnRedo />
              <Separator />
              <BtnBold />
              <BtnItalic />
              <BtnUnderline />
              <BtnStrikeThrough />
              <Separator />
              <BtnNumberedList />
              <BtnBulletList />
              <Separator />
              <BtnLink />
              <BtnClearFormatting />
              <Separator />
              <BtnStyles />
            </Toolbar>
          </Editor>
        </EditorProvider>
      </div>
    );
  },
);
