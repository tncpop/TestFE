'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { signOut, SessionProvider } from 'next-auth/react';

interface MainLayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: MainLayoutProps) {
  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: '/login',
    });
  };

  return (
    <>
      {/* Header */}
      <header style={{
        backgroundColor: '#0070f3',
        color: 'white',
        padding: '15px 15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1>My App</h1>
        <nav>
          <Link href="/" style={{ color: 'white', marginRight: '15px' }}>Home</Link>
          <Link href="/messages" style={{ color: 'white', marginRight: '15px' }}>Messages</Link>
          <Link href="/user" style={{ color: 'white', marginRight: '15px' }}>User Management</Link>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
              borderRadius: '5px'
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main style={{ padding: '20px', minHeight: 'calc(100vh - 70px)' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#eee',
        padding: '10px 20px',
        textAlign: 'center'
      }}>
        © 2025 My App
      </footer>
    </>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  // ห่อ children ด้วย SessionProvider
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>
        <SessionProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
        </SessionProvider>
      </body>
    </html>
  );
}
