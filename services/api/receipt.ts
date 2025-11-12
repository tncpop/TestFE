import axios from 'axios';

const API_URL = 'http://localhost:3001/sales'; // ตรงกับ NestJS Sales API

export const getReceipts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // คืนค่าเป็น array ของ receipt
  } catch (error) {
    console.error('Failed to fetch receipts:', error);
    return [];
  }
};

export const getReceiptById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch receipt ${id}:`, error);
    return null;
  }
};
// POST ข้อมูลการขายใหม่
export const createReceipt = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Failed to create receipt:', error);
    return null;
  }
};