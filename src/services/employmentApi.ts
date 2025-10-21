import api from './api';
import type { Employment } from '../types';

export const getAllEmployment = async (): Promise<Employment[]> => {
  const res = await api.get<Employment[]>('/employment');
  return res.data;
};


export const createEmployment = async (data: Partial<Employment>) => {
  const res = await api.post('/employment/create', data);
  return res.data;
};

export const updateEmployment = async (id: string, data: Partial<Employment>) => {
  const res = await api.put(`/employment/update/${id}`, data);
  return res.data;
};

export const deleteEmployment = async (id: string) => {
  const res = await api.delete(`/employment/delete/${id}`);
  return res.data;
};
