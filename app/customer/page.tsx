'use client';
import { useEffect, useState } from 'react';
import { createCustomer, deleteCustomer, getCustomers, Customer } from '@/services/api/customer';
import { FaTrash } from 'react-icons/fa';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError('กรุณากรอกชื่อ');
      return;
    }
    try {
      await createCustomer(name, phone);
      setName('');
      setPhone('');
      fetchCustomers();
      setError('');
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถเพิ่มลูกค้าได้');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('ต้องการลบลูกค้าคนนี้ใช่ไหม?')) return;
    try {
      await deleteCustomer(id);
      fetchCustomers();
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถลบลูกค้าได้');
    }
  };

  return (
    <div style={{
      padding: '30px',
      fontFamily: 'Prompt, sans-serif',
      backgroundColor: '#fffaf6',
      minHeight: '100vh',
    }}>
      <h2 style={{
        fontSize: '1.8rem',
        fontWeight: 700,
        color: '#c77b30',
        marginBottom: '20px',
        textAlign: 'left',
      }}>จัดการลูกค้า</h2>

      {error && <p style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

      {/* Add Form */}
      <form
        onSubmit={handleAdd}
        style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <input
          placeholder="ชื่อ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', flex: '1 0 150px' }}
        />
        <input
          placeholder="เบอร์โทร (ถ้ามี)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', flex: '1 0 150px' }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#27ae60',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          เพิ่ม
        </button>
      </form>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0e0d0' }}>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>ID</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>ชื่อ</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>เบอร์โทร</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>แต้ม</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>วันที่สมัคร</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>ลบ</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} style={{ textAlign: 'center', borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{c.id}</td>
              <td style={{ padding: '10px' }}>{c.name}</td>
              <td style={{ padding: '10px' }}>{c.phone || '-'}</td>
              <td style={{ padding: '10px' }}>{c.points}</td>
              <td style={{ padding: '10px' }}>{new Date(c.createdAt).toLocaleDateString('th-TH')}</td>
              <td style={{ padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <FaTrash
                    onClick={() => handleDelete(c.id)}
                    style={{ cursor: 'pointer', color: '#e74c3c' }}
                    title="ลบ"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
