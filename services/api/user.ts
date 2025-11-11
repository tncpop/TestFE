import axios from 'axios';

const API_URL = 'http://localhost:3001/user'; // BE URL

export const getUsers = async () => {
  const res = await axios.get(API_URL);
  return res.data; // [{ id, username, role }, ...]
};

// เพิ่ม role ตอนสร้าง user
export const createUser = async (username: string, password: string, role: string) => {
  const res = await axios.post(`${API_URL}/register`, { username, password, role });
  return res.data;
};

// เพิ่ม role ตอนแก้ไข user
export const updateUser = async (id: number, username: string, password?: string, role?: string) => {
  const res = await axios.put(`${API_URL}/${id}`, { username, password, role });
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
