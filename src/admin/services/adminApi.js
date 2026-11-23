import axios from 'axios';

const adminApi = axios.create({
  baseURL: 'http://localhost:5000',
});

export const getProducts = async () => (await adminApi.get('/products')).data;
export const getProduct = async id =>
  (await adminApi.get(`/products/${encodeURIComponent(id)}`)).data;
export const createProduct = async product =>
  (await adminApi.post('/products', product)).data;
export const updateProduct = async (id, product) =>
  (await adminApi.patch(`/products/${encodeURIComponent(id)}`, product)).data;
export const deleteProduct = async id =>
  adminApi.delete(`/products/${encodeURIComponent(id)}`);

export const getOrders = async () => (await adminApi.get('/orders')).data;
export const updateOrder = async (id, changes) =>
  (await adminApi.patch(`/orders/${encodeURIComponent(id)}`, changes)).data;

export const getCustomers = async () => (await adminApi.get('/users')).data;

export const getCategories = async () =>
  (await adminApi.get('/categories')).data;
export const createCategory = async category =>
  (await adminApi.post('/categories', category)).data;
export const deleteCategory = async id =>
  adminApi.delete(`/categories/${encodeURIComponent(id)}`);

export const loginAdminRequest = async email => {
  const response = await adminApi.get('/users', {
    params: { email: email.trim().toLowerCase() },
  });

  return response.data;
};