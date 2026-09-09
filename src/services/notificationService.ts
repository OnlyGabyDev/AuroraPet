import { AppNotification } from '../types/notification';
import { apiFetch } from './api';

export const notificationService = {
  /**
   * Retorna as notificações do usuário atual
   */
  async getNotifications(userId?: string): Promise<AppNotification[]> {
    return apiFetch<AppNotification[]>(
      `/notifications${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`
    );
  },

  /**
   * Marca uma notificação como lida
   */
  async markAsRead(notificationId: string): Promise<void> {
    await apiFetch(`/notifications/${encodeURIComponent(notificationId)}/read`, {
      method: 'PUT',
    });
  },

  /**
   * Marca todas as notificações do usuário como lidas
   */
  async markAllAsRead(userId?: string): Promise<void> {
    await apiFetch(
      `/notifications/read-all${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`,
      { method: 'PUT' }
    );
  },

  /**
   * Adiciona uma nova notificação ao sistema
   */
  async addNotification(
    notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>
  ): Promise<AppNotification> {
    return apiFetch<AppNotification>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notif),
    });
  },
};
