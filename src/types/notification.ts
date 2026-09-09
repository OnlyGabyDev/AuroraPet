export type NotificationType = 'ACCESS_GRANTED' | 'ACCESS_REVOKED' | 'REQUEST_UPDATE' | 'APPOINTMENT' | 'SYSTEM';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}
