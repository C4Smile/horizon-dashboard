import { ReactNode } from "react";

type TabType = {
  id: number;
  label: string;
};

export type TabsLayoutPropsType = {
  id: number;
  entity: string;
  tabs: TabType[];
  content: { [key: number]: ReactNode };
  name: string;
};
