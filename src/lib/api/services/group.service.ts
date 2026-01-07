import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  Group,
  GroupWithContactsResponse,
  CreateGroupData,
  UpdateGroupData
} from '@/types/entities/group.types';

export const groupService = {
  // Get all groups - returns array per API documentation
  getAll: async (): Promise<Group[]> => {
    const response = await apiClient.get(API_ENDPOINTS.GROUPS);
    return response.data;
  },

  // Get group by ID with contacts and custom fields
  getById: async (id: string): Promise<GroupWithContactsResponse> => {
    const response = await apiClient.get(`${API_ENDPOINTS.GROUPS}/${id}`);
    return response.data;
  },

  create: async (data: CreateGroupData): Promise<Group> => {
    const response = await apiClient.post(API_ENDPOINTS.GROUPS, data);
    return response.data;
  },

  update: async (id: string, data: UpdateGroupData): Promise<Group> => {
    const response = await apiClient.put(`${API_ENDPOINTS.GROUPS}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.GROUPS}/${id}`);
  },

  assignContacts: async (groupId: string, contactIds: string[]): Promise<void> => {
    await apiClient.post(`${API_ENDPOINTS.CONTACT_GROUPS}/assign`, { groupId, contactIds });
  },

  removeContacts: async (groupId: string, contactIds: string[]): Promise<void> => {
    // Axios delete with body requires 'data' property
    await apiClient.delete(`${API_ENDPOINTS.CONTACT_GROUPS}/remove`, {
      data: { groupId, contactIds }
    });
  },
};
