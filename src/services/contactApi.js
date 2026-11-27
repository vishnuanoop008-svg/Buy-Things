import axios from 'axios';

const contactApi = axios.create({
  baseURL: 'http://localhost:5000',
});

export const submitContactMessage = async (message) => {
  const response = await contactApi.post('/messages', message);
  return response.data;
};

export const getContactMessages = async () => {
  const response = await contactApi.get('/messages');
  return response.data;
};