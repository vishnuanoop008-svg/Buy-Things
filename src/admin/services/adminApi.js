import axios from 'axios';

const adminApi = axios.create({
  baseURL: 'http://localhost:5000',
});

const productPath = (id) => `/products/${encodeURIComponent(id)}`;

export const getProducts = async () => {
  const { data } = await adminApi.get('/products');
  return data.filter((product) => product.isDeleted !== true);
};

export const getTrashedProducts = async () => {
  const { data } = await adminApi.get('/products');
  return data.filter((product) => product.isDeleted === true);
};

export const getProduct = async (id) =>
  (await adminApi.get(productPath(id))).data;

export const createProduct = async (product) =>
  (
    await adminApi.post('/products', {
      ...product,
      isDeleted: false,
    })
  ).data;

export const updateProduct = async (id, product) =>
  (await adminApi.patch(productPath(id), product)).data;

export const trashProduct = async (id) =>
  (await adminApi.patch(productPath(id), { isDeleted: true })).data;

export const restoreProduct = async (id) =>
  (await adminApi.patch(productPath(id), { isDeleted: false })).data;

// Permanent deletion, if needed for a separate “Delete forever” action.
export const deleteProduct = async (id) =>
  adminApi.delete(productPath(id));

export const getOrders = async () =>
  (await adminApi.get('/orders')).data;

export const updateOrder = async (id, changes) =>
  (await adminApi.patch(`/orders/${encodeURIComponent(id)}`, changes)).data;

export const getCustomers = async () =>
  (await adminApi.get('/users')).data;

export const getCategories = async () =>
  (await adminApi.get('/categories')).data;

export const createCategory = async (category) =>
  (await adminApi.post('/categories', category)).data;

export const deleteCategory = async (id) =>
  adminApi.delete(`/categories/${encodeURIComponent(id)}`);

export const loginAdminRequest = async (email) => {
  const response = await adminApi.get('/users', {
    params: { email: email.trim().toLowerCase() },
  });

  return response.data;
};