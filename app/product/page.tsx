'use client';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { getProducts, createProduct, Product } from '@/services/api/product';

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    type: 'เครื่องดื่ม',
    image: '',
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    type: 'เครื่องดื่ม',
    image: '',
  });

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      return alert('กรอกข้อมูลให้ครบ!');
    }

    const created = await createProduct(newProduct);
    if (created) {
      setProducts([...products, created]);
      setNewProduct({ name: '', price: 0, type: 'เครื่องดื่ม', image: '' });
    } else {
      alert('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
    }
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditValues({ name: p.name, price: p.price, type: p.type, image: p.image });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...editValues } : p));
    setEditingId(null);
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Prompt, sans-serif', backgroundColor: '#fffaf6', minHeight: '100vh' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#c77b30', marginBottom: '20px' }}>จัดการสินค้า</h2>

      {/* Form เพิ่มสินค้า */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="ชื่อสินค้า"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', flex: '1 0 150px' }}
        />
        <input
          type="number"
          placeholder="ราคา"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '100px' }}
        />
        <select
          value={newProduct.type}
          onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value as 'เครื่องดื่ม' | 'ขนมหวาน' })}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
        >
          <option value="เครื่องดื่ม">เครื่องดื่ม</option>
          <option value="ขนมหวาน">ขนมหวาน</option>
        </select>
        <input
          type="text"
          placeholder="URL รูปสินค้า"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', flex: '1 0 200px' }}
        />
        <button
          onClick={addProduct}
          style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#27ae60', color: '#fff', fontWeight: 600 }}
        >
          เพิ่มสินค้า
        </button>
      </div>

      {loading && <p>กำลังโหลดสินค้า...</p>}

      {/* ตารางสินค้า */}
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0e0d0' }}>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>ID</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>รูป</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>ชื่อสินค้า</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>ราคา</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>ประเภท</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td style={{ padding: '10px', textAlign: 'center' }}>{p.id}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                {editingId === p.id ? (
                  <input
                    type="text"
                    value={editValues.image}
                    onChange={(e) => setEditValues({ ...editValues, image: e.target.value })}
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                ) : (
                  <img src={p.image} alt={p.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                )}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                {editingId === p.id ? (
                  <input
                    type="text"
                    value={editValues.name}
                    onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                  />
                ) : p.name}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                {editingId === p.id ? (
                  <input
                    type="number"
                    value={editValues.price}
                    onChange={(e) => setEditValues({ ...editValues, price: parseFloat(e.target.value) })}
                  />
                ) : `${p.price} บาท`}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                {editingId === p.id ? (
                  <select
                    value={editValues.type}
                    onChange={(e) => setEditValues({ ...editValues, type: e.target.value as 'เครื่องดื่ม' | 'ขนมหวาน' })}
                  >
                    <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                    <option value="ขนมหวาน">ขนมหวาน</option>
                  </select>
                ) : p.type}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  {editingId === p.id ? (
                    <>
                      <button onClick={() => saveEdit(p.id)} style={{ color: '#27ae60', cursor: 'pointer' }}><FaCheck /></button>
                      <button onClick={cancelEdit} style={{ color: '#e74c3c', cursor: 'pointer' }}><FaTimes /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(p)} style={{ color: '#2980b9', cursor: 'pointer' }}><FaEdit /></button>
                      <button onClick={() => deleteProduct(p.id)} style={{ color: '#e74c3c', cursor: 'pointer' }}><FaTrash /></button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
