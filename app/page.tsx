'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { getProducts } from '@/services/api/product';

interface Product {
  id: number;
  name: string;
  price: number;
  type: 'เครื่องดื่ม' | 'ขนมหวาน';
  image: string;
}

interface Promo {
  id: number;
  title: string;
  description: string;
}

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [username, setUsername] = useState('');

  const [products, setProducts] = useState<Product[]>([]);

  const promos: Promo[] = [
    { id: 1, title: 'ลด 10% สำหรับ 2 แก้ว', description: 'สั่งเครื่องดื่มครบ 2 แก้ว รับส่วนลดทันที!' },
    { id: 2, title: 'โปรแรงวันศุกร์', description: 'เครื่องดื่มทุกชนิด ลด 20% เฉพาะวันศุกร์' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

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
      const shuffled = allProducts.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 7); // เอาแค่ 7 ตัว
      setProducts(selected);

      // ตั้ง currentIndex เริ่มต้นที่ตัวที่ 4 ถ้ามีสินค้าอย่างน้อย 4 ตัว
      setCurrentIndex(selected.length >= 4 ? 3 : 0);
    } catch (err) {
      console.error(err);
    }
  };
  fetchProducts();
}, []);

  const cardStyle = {
    width: '250px',
    borderRadius: '12px',
    overflow: 'hidden',
    textAlign: 'center' as const,
    backgroundColor: '#fffaf6',
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, opacity 0.3s',
  };

  const prev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const next = () => setCurrentIndex((prev) => Math.min(prev + 1, products.length - 1));

  return (
    <div style={{ padding: '20px', fontFamily: 'Prompt, sans-serif', color: '#333' }}>
      {username && (
        <h2 style={{ textAlign: 'center', marginBottom: '70px', fontWeight: 700, fontSize: '1.8rem', color: '#c77b30' }}>
          เมนูแนะนำ
        </h2>
      )}

      {/* Carousel เมนูทั้งหมด */}
      <section style={{ position: 'relative', marginBottom: '100px', height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          style={{
            position: 'absolute',
            left: '-20px',
            zIndex: 10,
            background: 'rgba(199,123,48,0.8)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            color: '#fff',
            fontWeight: 700,
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          &lt;
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', perspective: '1000px', position: 'relative', width: '100%', maxWidth: '850px' }}>
          {products.map((product, index) => {
            const offset = index - currentIndex;
            const scale = offset === 0 ? 1 : 0.8;
            const opacity = offset === 0 ? 1 : 0.4;
            const zIndex = offset === 0 ? 2 : 1;
            const transform = `translateX(${offset * 270}px) scale(${scale})`;
            return (
              <div key={product.id} style={{ ...cardStyle, position: 'absolute', transform, opacity, zIndex }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                <div style={{ padding: '12px' }}>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '6px' }}>{product.name}</p>
                  <p style={{ fontWeight: 500, color: '#5c4033', marginBottom: '10px' }}>{product.price} บาท</p>
                  <p style={{ fontSize: '0.9rem', color: '#8b5e3c', marginBottom: '5px' }}>{product.type}</p>
                  <Link
                    href="/menu"
                    style={{
                      display: 'inline-block',
                      marginTop: '5px',
                      padding: '7px 14px',
                      backgroundColor: '#c77b30',
                      color: '#fff',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    สั่งซื้อ
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={next}
          disabled={currentIndex === products.length - 1}
          style={{
            position: 'absolute',
            right: '-20px',
            zIndex: 10,
            background: 'rgba(199,123,48,0.8)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            color: '#fff',
            fontWeight: 700,
            cursor: currentIndex === products.length - 1 ? 'not-allowed' : 'pointer',
          }}
        >
          &gt;
        </button>
      </section>

      {/* โปรโมชั่น */}
      <section>
        <h3 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 700, fontSize: '1.5rem', color: '#c77b30' }}>
          โปรโมชั่นวันนี้
        </h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {promos.map((promo) => (
            <div key={promo.id} style={{ ...cardStyle }}>
              <h4 style={{ color: '#c77b30', fontWeight: 600, fontSize: '1.2rem', marginTop: '15px' }}>{promo.title}</h4>
              <p style={{ fontWeight: 500, fontSize: '0.95rem', padding: '0 10px', marginTop: '8px' }}>{promo.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
