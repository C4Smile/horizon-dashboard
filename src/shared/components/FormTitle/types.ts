import { ReactNode } from "react";

export type FormTitlePropsType = {
  children: ReactNode;
};

/** What the model layout hands down to the routes it mounts. */
export type ModelOutletContext = {
  listPath: string;
};
