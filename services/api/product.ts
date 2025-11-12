import axios from 'axios';

export interface Product {
  id: number;
  name: string;
  price: number;
  type: 'เครื่องดื่ม' | 'ขนมหวาน';
  image: string;
}

const API_URL = 'http://localhost:3001/products'; // backend port ของเรา

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
};

export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const response = await axios.get<Product>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return null;
  }
};

// ฟังก์ชันเพิ่มสินค้า
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  try {
    const response = await axios.post<Product>(API_URL, product);
    return response.data;
  } catch (error) {
    console.error('Failed to create product:', error);
    return null;
  }
};
