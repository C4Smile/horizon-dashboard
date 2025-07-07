import { ReactNode } from "react";

// lib
import { NotificationType } from "lib";

export enum NotificationSeverity {
  default = "default",
  bad = "bad",
  ugly = "ugly",
  good = "good",
}

export type NotificationContextType = {
  notification: NotificationType[];
  removeNotification: (index?: number) => void;
  showErrorNotification: (options: NotificationType) => void;
  showNotification: (options: NotificationType) => void;
  showSuccessNotification: (options: NotificationType) => void;
  showStackNotifications: (notifications: NotificationType[]) => void;
};

export type NotificationProviderPropsType = {
  children: ReactNode;
};
