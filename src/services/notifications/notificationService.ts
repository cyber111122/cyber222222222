import type { AppNotification } from '@/types';

export interface NotificationService {
  getNotifications(): Promise<AppNotification[]>;
}
