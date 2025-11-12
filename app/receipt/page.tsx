'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getReceipts } from '@/services/api/receipt';

interface ReceiptItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  type: string;
}

interface Receipt {
  id: number;
  username: string;
  items: ReceiptItem[];
  total_price: number;
  payment_method: 'cash' | 'qr';
  cash_received?: number | null;
  change?: number | null;
  created_at: string;
}

export default function ReceiptPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const data = await getReceipts();
        // แปลง type ให้ตรงกับ TS
        const formattedData: Receipt[] = data.map((r: any) => ({
          ...r,
          payment_method: r.payment_method === 'cash' ? 'cash' : 'qr',
          total_price: parseFloat(r.total_price),
          cash_received: r.cash_received ? parseFloat(r.cash_received) : null,
          change: r.change ? parseFloat(r.change) : null,
          items: r.items.map((item: any) => ({
            ...item,
            price: parseFloat(item.price),
          })),
        }));
        setReceipts(formattedData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReceipts();
  }, []);

  if (status === 'unauthenticated') return null;

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '-';
    const thaiTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return thaiTime.toLocaleString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', padding: '20px', fontFamily: 'Prompt, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#c77b30', marginBottom: '20px' }}>ประวัติการขาย</h2>

      {receipts.length === 0 && <p style={{ textAlign: 'center' }}>ยังไม่มีประวัติการขาย</p>}

      {receipts.map((r) => (
        <div key={r.id} style={{ marginBottom: '30px', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fffaf6' }}>
          <div style={{ marginBottom: '10px', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
            <span>บิล #{r.id}</span>
            <span>{formatDateTime(r.created_at)}</span>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>พนักงาน:</strong> {r.username}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#c77b30', color: 'white' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>สินค้า</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>จำนวน</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>ราคา</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>รวม</th>
              </tr>
            </thead>
            <tbody>
              {r.items.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.name}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{item.price} บาท</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>{item.price * item.quantity} บาท</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
            <span>รวมทั้งหมด:</span>
            <span>{r.total_price} บาท</span>
          </div>

          <div style={{ marginTop: '5px', fontWeight: 500 }}>
            วิธีชำระเงิน: {r.payment_method === 'cash' ? 'เงินสด' : 'QR'}
          </div>

          {r.payment_method === 'cash' && (
            <div style={{ marginTop: '3px', fontWeight: 500 }}>
              รับเงิน: {r.cash_received} บาท, เงินทอน: {r.change} บาท
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
