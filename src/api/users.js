import api from './client';

export async function listUsers(params = {}) {
  const { data } = await api.get('/users', { params });
  return data; // { success, data: [], total }
}

export async function getUser(id) {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export async function createUser(payload) {
  const { data } = await api.post('/users', payload);
  return data;
}

export async function updateUser(id, payload) {
  const { data } = await api.put(`/users/${id}`, payload);
  return data;
}

export async function deactivateUser(id) {
  const { data } = await api.delete(`/users/${id}`);
  return data;
}

export async function updateFaceDescriptor(id, descriptorArray) {
  const { data } = await api.put(`/users/${id}/face`, { descriptor: descriptorArray });
  return data;
}

export async function identifyByDescriptor(descriptorArray, threshold = 0.5) {
  const { data } = await api.post('/users/identify', { descriptor: descriptorArray, threshold });
  return data;
}
