import api from './client';

export async function listItems(params = {}) {
  const { data } = await api.get('/items', { params });
  return data; // { success, data: [], total }
}

export async function getItem(id) {
  const { data } = await api.get(`/items/${id}`);
  return data;
}

export async function createItem(payload) {
  const { data } = await api.post('/items', payload);
  return data;
}

export async function updateItem(id, payload) {
  const { data } = await api.put(`/items/${id}`, payload);
  return data;
}

export async function deleteItem(id) {
  const { data } = await api.delete(`/items/${id}`);
  return data;
}

export async function findByCode(code) {
  const { data } = await api.get(`/items/code/${encodeURIComponent(code)}`);
  return data;
}
