import { ReactNode } from 'react';
import Link from 'next/link';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>
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
            <Link href="/messages" style={{ color: 'white' }}>Messages</Link>
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
      </body>
    </html>
  );
}
