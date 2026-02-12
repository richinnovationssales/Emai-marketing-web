import apiClient from "../client";
import { API_ENDPOINTS } from "../endpoints";
import {
  Client,
  CreateClientDTO,
  UpdateClientDTO,
  ClientWithStats,
  ClientDetails,
  ClientAnalytics,
  OnboardClientDTO,
} from "@/types/entities/client.types";
import { ApiResponse } from "@/types/api/response.types";

export const clientService = {
  // Get all clients
  getAll: async (): Promise<ClientWithStats[]> => {
    const { data } = await apiClient.get<ApiResponse<ClientWithStats[]>>(
      API_ENDPOINTS.CLIENTS.BASE
    );
    return data.data;
  },

  // Get pending clients
  getPending: async (): Promise<ClientWithStats[]> => {
    const { data } = await apiClient.get<ApiResponse<ClientWithStats[]>>(
      API_ENDPOINTS.CLIENTS.PENDING
    );
    return data.data;
  },

  // Get client by ID (basic info with stats)
  getById: async (id: string): Promise<ClientWithStats> => {
    const { data } = await apiClient.get<ApiResponse<ClientWithStats>>(
      API_ENDPOINTS.CLIENTS.BY_ID(id)
    );
    return data.data;
  },

  // Get client details (extended with users, contacts, groups, custom fields)
  getDetails: async (id: string): Promise<ClientDetails> => {
    const { data } = await apiClient.get<ApiResponse<ClientDetails>>(
      API_ENDPOINTS.CLIENTS.BY_ID(id)
    );
    return data.data;
  },

  // Create client
  create: async (clientData: CreateClientDTO): Promise<Client> => {
    const { data } = await apiClient.post<ApiResponse<Client>>(
      API_ENDPOINTS.CLIENTS.BASE,
      clientData
    );
    return data.data;
  },

  // Update client
  update: async (id: string, clientData: UpdateClientDTO): Promise<Client> => {
    const { data } = await apiClient.put<ApiResponse<Client>>(
      API_ENDPOINTS.CLIENTS.BY_ID(id),
      clientData
    );
    return data.data;
  },

  // Delete client
  deleteClient: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CLIENTS.BY_ID(id));
  },

  // Approve client
  approve: async (id: string): Promise<Client> => {
    const { data } = await apiClient.patch<ApiResponse<Client>>(
      API_ENDPOINTS.CLIENTS.APPROVE(id)
    );
    return data.data;
  },

  // Reject client
  reject: async (id: string): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.CLIENTS.REJECT(id));
  },

  deactivate: async (id: string): Promise<Client> => {
    const response = await apiClient.patch<Client>(
      API_ENDPOINTS.CLIENTS.DEACTIVATE(id)
    );

    console.log("CLIENT:", response.data);
    return response.data;
  },

  reactivate: async (id: string): Promise<Client> => {
    const response = await apiClient.patch<Client>(
      API_ENDPOINTS.CLIENTS.REACTIVATE(id)
    );

    return response.data;
  },

  // Get client analytics
  // Get client analytics
  getAnalytics: async (id: string): Promise<ClientAnalytics> => {
    const { data } = await apiClient.get<ApiResponse<ClientAnalytics>>(
      API_ENDPOINTS.CLIENTS.ANALYTICS(id)
    );
    return data.data;
  },

  // Onboard client
  onboard: async (onboardData: OnboardClientDTO): Promise<Client> => {
    const { data } = await apiClient.post<ApiResponse<Client>>(
      API_ENDPOINTS.CLIENTS.ONBOARD,
      onboardData
    );
    return data.data;
  },
};
