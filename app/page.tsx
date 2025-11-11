'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession(); // ดึง session
  const [username, setUsername] = useState('');

  // ดึง username จาก session
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.username) {
      setUsername(session.user.username);
    }
  }, [session, status]);

  // ถ้าไม่ได้ login redirect ไปหน้า login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Hello, {username || 'Guest'}</h1>

      <button
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#18ff18ff',
          color: 'white',
          width: '200px',
        }}
        onClick={() => router.push('/messages')}
      >
        ไปหน้า Messages
      </button>
      <span> </span>
      <button
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#18ff18ff',
          color: 'white',
          width: '200px',
        }}
        onClick={() => router.push('/user')}
      >
        ไปหน้า User
      </button>
    </div>
  );
}
