import { ReactNode } from "react";

export enum NotificationSeverity {
  default = "default",
  bad = "bad",
  ugly = "ugly",
  good = "good",
}

export type NotificationContextType = {
  notification: string;
  setNotification: (
    message: string,
    params?: Record<string, string>,
    severity?: NotificationSeverity
  ) => void;
  params: Record<string, string>;
  state: NotificationSeverity;
};

export type NotificationProviderPropsType = {
  children: ReactNode;
};
