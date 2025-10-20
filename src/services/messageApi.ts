import api from './api';
import type { Message } from '../types';

// Get all
export const getAllMessages = async (): Promise<Message[]> => {
  const res = await api.get('/messages/');
  return res.data;
};

// Delete
export const deleteMessage = async (id: string) => {
  const res = await api.delete(`/messages/${id}`);
  return res.data;
};

// Update status
export const updateMessageStatus = async (id: string, status: string) => {
  const res = await api.patch(`/messages/${id}/status`, { status });
  return res.data;
};
