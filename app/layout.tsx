'use client';

import { ReactNode } from 'react';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: LayoutProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const pathname = usePathname(); // path ปัจจุบัน

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  const hideLayout = pathname === '/login'; // ถ้าอยู่หน้า /login ให้ซ่อน header/footer

  return (
    <>
      {!hideLayout && (
        <>
          {/* Header */}
          <header style={{
            backgroundColor: '#fff7f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            padding: '15px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#5c4033' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', fontFamily: 'Prompt, sans-serif' }}>☕ Café Cloud</h1>
            </Link>

            <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <Link href="/" style={{ color: '#5c4033', textDecoration: 'none', fontWeight: 500 }}>หน้าแรก</Link>
              <Link href="/pos" style={{ color: '#5c4033', textDecoration: 'none', fontWeight: 500 }}>POS</Link>
              {isAdmin && <Link href="/user" style={{ color: '#5c4033', textDecoration: 'none', fontWeight: 500 }}>จัดการผู้ใช้งานในระบบ</Link>}
              {isAdmin && <Link href="/customer" style={{ color: '#5c4033', textDecoration: 'none', fontWeight: 500 }}>จัดการลูกค้า</Link>}
              {isAdmin && <Link href="/product" style={{ color: '#5c4033', textDecoration: 'none', fontWeight: 500 }}>จัดการสินค้า</Link>}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link href="/cart" style={{ color: '#5c4033', fontSize: '1.2rem' }}><FaShoppingCart /></Link>
              <Link href="/profile" style={{ color: '#5c4033', fontSize: '1.2rem' }}><FaUser /></Link>
              <button onClick={handleLogout} style={{
                backgroundColor: '#c77b30',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500
              }}>ออกจากระบบ</button>
            </div>
          </header>

          <main style={{ padding: '30px', minHeight: 'calc(100vh - 150px)', backgroundColor: '#fffaf6' }}>
            {children}
          </main>

          <footer style={{ backgroundColor: '#5c4033', color: 'white', padding: '20px 30px', textAlign: 'center', fontSize: '0.9rem' }}>
            © 2025 Café Cloud — Freshly Brewed Every Day ☕
          </footer>
        </>
      )}

      {hideLayout && (
        <main style={{ padding: '50px 30px', minHeight: '100vh', backgroundColor: '#fffaf6' }}>
          {children}
        </main>
      )}
    </>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body style={{ margin: 0, fontFamily: 'Prompt, sans-serif' }}>
        <SessionProvider>
          <LayoutContent>{children}</LayoutContent>
        </SessionProvider>
      </body>
    </html>
  );
}
