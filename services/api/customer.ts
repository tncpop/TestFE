import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Customer {
  id: number;
  name: string;
  phone?: string;
  points: number;
  createdAt: string;
}

// ✅ ดึงลูกค้าทั้งหมด
export async function getCustomers(): Promise<Customer[]> {
  const res = await axios.get(`${API_URL}/customers`);
  return res.data;
}

// ✅ เพิ่มลูกค้าใหม่
export async function createCustomer(name: string, phone?: string): Promise<Customer> {
  const res = await axios.post(`${API_URL}/customers`, { name, phone });
  return res.data;
}

// ✅ ลบลูกค้า
export async function deleteCustomer(id: number): Promise<void> {
  await axios.delete(`${API_URL}/customers/${id}`);
}
