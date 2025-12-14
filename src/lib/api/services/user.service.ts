import apiClient from '../client';
export const userService = {
  getAll: async (clientId: string) => { const { data } = await apiClient.get('/users', { params: { clientId } }); return data.data; },
};
