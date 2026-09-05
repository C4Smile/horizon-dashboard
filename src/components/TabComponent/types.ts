import { ReactNode } from "react";

type TabType = {
  id: string;
  label: string;
};

export type TabsLayoutPropsType = {
  id: number;
  entity: string;
  tabs: TabType[];
  content: { [key: string]: ReactNode };
  name: string;
};
