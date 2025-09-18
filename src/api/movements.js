import api from './client';

export async function listMovements(params = {}) {
  const { data } = await api.get('/movements', { params });
  return data;
}

export async function createMovement({ itemId, userId, movementType, quantity, notes }) {
  const { data } = await api.post('/movements', { itemId, userId, movementType, quantity, notes });
  return data; // { success, data: movement, currentQuantity }
}
