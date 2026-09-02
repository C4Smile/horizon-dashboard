import { ReactNode } from "react";

// lib
import { NotificationType, UserDto } from "lib";

export type HorizonProviderPropsType = {
  children: ReactNode;
};

/**
 * Severity buckets `setNotification` maps to a notification type when the
 * caller does not pass one
 */
export enum NotificationSeverity {
  default = "default",
  bad = "bad",
  ugly = "ugly",
  good = "good",
}

/**
 * Horizon session as the app reads it: the shared session fields plus the
 * horizon user record the pages use for role checks
 */
export type HorizonAccountType = {
  id?: number;
  username?: string;
  email?: string;
  token?: string;
  horizonUser?: UserDto;
};

export type HorizonNotificationContextType = {
  notification: NotificationType[];
  removeNotification: (id?: number) => void;
  setNotification: (
    key: string,
    params?: Record<string, unknown>,
    severity?: NotificationSeverity,
  ) => void;
  showErrorNotification: (options: Partial<NotificationType>) => void;
  showNotification: (options: NotificationType) => void;
  showSuccessNotification: (options: Partial<NotificationType>) => void;
  showStackNotifications: (notifications: NotificationType[]) => void;
};
