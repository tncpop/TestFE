'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getProducts } from '@/services/api/product';
import { createReceipt } from '@/services/api/receipt';

interface Product {
  id: number;
  name: string;
  price: number;
  type: 'เครื่องดื่ม' | 'ขนมหวาน';
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function POSPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [username, setUsername] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filter, setFilter] = useState<'ทั้งหมด' | 'เครื่องดื่ม' | 'ขนมหวาน'>('ทั้งหมด');

  // Payment state
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr' | null>(null);
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.username) {
      setUsername(session.user.username);
    }
  }, [session, status]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getProducts();
        setProducts(allProducts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCashPayment = () => {
    if (cashReceived < totalPrice) {
      alert('จำนวนเงินที่รับมาน้อยกว่าราคาสินค้า');
      return;
    }
    setChange(cashReceived - totalPrice);
    setShowReceipt(true);
  };

  const productCardStyle = {
    width: '200px',
    borderRadius: '12px',
    overflow: 'hidden',
    textAlign: 'center' as const,
    backgroundColor: '#fffaf6',
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
    margin: '10px',
    cursor: 'pointer',
  };

  const filteredProducts =
    filter === 'ทั้งหมด' ? products : products.filter((p) => p.type === filter);

  const btnStyle = {
    padding: '10px 20px',
    marginBottom: '10px',
    width: '100%',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#27ae60',
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',
  };

  const cancelBtnStyle = {
    padding: '10px 20px',
    marginBottom: '10px',
    width: '100%',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#e04640ff',
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',
  };

  if (status === 'unauthenticated') return null;

  return (
    <div style={{ display: 'flex', padding: '20px', fontFamily: 'Prompt, sans-serif', color: '#333', gap: '20px' }}>
      {/* ซ้าย: สินค้า */}
      <div style={{ flex: '0 0 70%' }}>
        <h2 style={{ marginBottom: '20px', fontWeight: 700, fontSize: '1.8rem', color: '#c77b30' }}>
          เมนูสินค้า
        </h2>

        <div style={{ marginBottom: '20px' }}>
          {['ทั้งหมด', 'เครื่องดื่ม', 'ขนมหวาน'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              style={{
                marginRight: '10px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filter === type ? '#c77b30' : '#f0e0d0',
                color: filter === type ? '#fff' : '#333',
                fontWeight: 600,
              }}
            >
              {type}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {filteredProducts.map((product) => (
            <div key={product.id} style={productCardStyle} onClick={() => addToCart(product)}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
              <div style={{ padding: '10px' }}>
                <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '5px' }}>{product.name}</p>
                <p style={{ fontWeight: 500, color: '#5c4033' }}>{product.price} บาท</p>
                <p style={{ fontSize: '0.9rem', color: '#8b5e3c' }}>{product.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ขวา: ตะกร้า */}
      <div
        style={{
          flex: '0 0 30%',
          backgroundColor: '#fffaf6',
          padding: '15px',
          borderRadius: '12px',
          boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          height: '600px',
        }}
      >
        <h2 style={{ marginBottom: '20px', fontWeight: 700, fontSize: '1.5rem', color: '#c77b30' }}>
          ตะกร้าสินค้า
        </h2>

        {cart.length === 0 && <p>ยังไม่มีสินค้าในตะกร้า</p>}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                alignItems: 'center',
                backgroundColor: '#fff4e0',
                padding: '6px 10px',
                borderRadius: '6px',
              }}
            >
              <span style={{ fontWeight: 600 }}>{item.name}</span>
              <span>
                {item.quantity} x {item.price} บาท
              </span>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>➖</button>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>➕</button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ marginBottom: '10px', fontWeight: 700, fontSize: '1.2rem' }}>
              รวมทั้งหมด: {totalPrice} บาท
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setCart([])}
                style={{ ...cancelBtnStyle, flex: 1 }}
              >
                ยกเลิกทั้งหมด
              </button>
              <button
                onClick={() => setShowPaymentPopup(true)}
                style={{ ...btnStyle, flex: 1 }}
              >
                ยืนยันการสั่งซื้อ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Popup */}
      {showPaymentPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: '#fffaf6', padding: '20px', borderRadius: '12px', width: '320px', textAlign: 'center' }}>

            {/* เลือกวิธีชำระเงิน */}
            {!paymentMethod && (
              <>
                <h3 style={{ marginBottom: '15px', color: '#c77b30' }}>เลือกวิธีชำระเงิน</h3>
                <button onClick={() => setPaymentMethod('cash')} style={btnStyle}>เงินสด</button>
                <button onClick={() => { setPaymentMethod('qr'); setShowReceipt(true); }} style={btnStyle}>สแกน QR</button>
                <button onClick={() => setShowPaymentPopup(false)} style={cancelBtnStyle}>ยกเลิก</button>
              </>
            )}

            {/* เงินสด */}
            {paymentMethod === 'cash' && !showReceipt && (
              <>
                <h3 style={{ marginBottom: '10px', color: '#c77b30' }}>เงินสด</h3>
                <p>รวมทั้งหมด: {totalPrice} บาท</p>
                <input
                  type="number"
                  placeholder="จำนวนเงินที่รับมา"
                  value={cashReceived}
                  onChange={e => setCashReceived(Number(e.target.value))}
                  style={{ padding: '8px', width: '80%', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <button onClick={handleCashPayment} style={btnStyle}>จ่ายเงิน</button>
                <button onClick={() => setPaymentMethod(null)} style={cancelBtnStyle}>ย้อนกลับ</button>
              </>
            )}

            {/* แสดงสลิป */}
            {showReceipt && (
              <>
                <h3 style={{ marginBottom: '10px', color: '#c77b30' }}>สลิปการชำระเงิน</h3>
                <div style={{ textAlign: 'left', marginBottom: '10px' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{item.name} x{item.quantity}</span>
                      <span>{item.price * item.quantity} บาท</span>
                    </div>
                  ))}
                </div>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                  <span>รวมทั้งหมด:</span>
                  <span>{totalPrice} บาท</span>
                </div>
                {paymentMethod === 'cash' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>รับมา:</span>
                      <span>{cashReceived} บาท</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>เงินทอน:</span>
                      <span>{change} บาท</span>
                    </div>
                  </>
                )}
                {paymentMethod === 'qr' && <p>ชำระผ่าน QR เรียบร้อย</p>}

                {/* ปุ่มเสร็จสิ้นพร้อม log ข้อมูล */}
                <button
                  onClick={async () => {
                    // สร้าง payload ให้ตรงกับ BE
                    const payload = {
                      username,
                      total_price: totalPrice,
                      payment_method: paymentMethod,
                      cash_received: paymentMethod === 'cash' ? cashReceived : null,
                      change: paymentMethod === 'cash' ? change : null,
                      items: cart.map(item => ({
                        product_id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        type: item.type,
                      })),
                    };

                    console.log('--- Sale Completed ---');
                    console.log(payload);

                    try {
                      await createReceipt(payload);
                      console.log('Receipt created successfully');
                    } catch (err) {
                      console.error('Failed to create receipt', err);
                    }

                    // รีเซ็ต state
                    setCart([]);
                    setShowPaymentPopup(false);
                    setPaymentMethod(null);
                    setShowReceipt(false);
                    setCashReceived(0);
                    setChange(0);
                  }}
                  style={btnStyle}
                >
                  เสร็จสิ้น
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
