import { ReactNode } from "react";

type TabType = {
  id: number;
  label: string;
};

export type TabPropsType = {
  tabs: TabType[];
  content: { [key: number]: ReactNode };
  onTabChange?: (id: number) => void;
};

export type TabsPropsType = {
  tabs: TabType[];
  onTabClick: (id: number) => void;
  currentTab: number;
};

export type TabsLayoutPropsType = {
  id: number;
  entity: string;
  tabs: TabType[];
  content: { [key: number]: ReactNode };
  name: string;
};
