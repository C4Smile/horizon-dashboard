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
    params?: Record<string, string | number>,
    severity?: NotificationSeverity
  ) => void;
  params: Record<string, string | number>;
  state: NotificationSeverity;
};

export type NotificationProviderPropsType = {
  children: ReactNode;
};
