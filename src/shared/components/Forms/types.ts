export type HtmlInputPropsType = {
  label?: string;
  /** html, the same shape the api stores and answers with */
  value?: string;
  onChange: (html: string) => void;
  wrapperClassName?: string;
  disabled?: boolean;
  name?: string;
};
