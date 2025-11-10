// frontend/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // URL ของ NestJS
  withCredentials: false,            // ถ้าใช้ session/cookie ให้เปิดเป็น true
});

// ตัวอย่างฟังก์ชัน GET
export const getExample = async () => {
  const res = await api.get('/example');
  return res.data;
};
export const getExample2 = async () => {
  const res = await api.get('/example/2');
  return res.data;
};
export const sendMessage = async (message: string) => {
  const res = await api.post('/example', { message });
  return res.data;
};

export const delMessage = async(id: number) =>{
  const res = await api.delete(`/example/${id}`)
  return  res.data;
}
export const updateMessage = async (id: number, message: string) => {
  const res = await api.patch(`/example/${id}`, { message });
  return res.data;
};
export default api;
