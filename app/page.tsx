"use client";

import { SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Next.js 13+ App Router
import { getExample } from '../services/api';

export default function Home() {
  const [message, setMessage] = useState('');
  const router = useRouter(); // เรียก useRouter

  useEffect(() => {
    getExample()
      .then((data: { message: SetStateAction<string>; }) => setMessage(data.message))
      .catch((err: any) => console.error(err));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{'Hello'}</h1>

      <button
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#18ff18ff', color: 'white', width: '200px'
        }}
        onClick={() => router.push('/messages')} // เมื่อคลิกไปหน้า /home
      >
        ไปหน้า Messages
      </button>
    </div>
  );
}
