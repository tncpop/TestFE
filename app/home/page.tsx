"use client";

import { useEffect, useState } from 'react';
import { getExample2 } from '../../services/api';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    getExample2()
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{message || 'Loading Home...'}</h1>

      <button
        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
        onClick={() => router.push('/')}
      >
        กลับหน้าแรก
      </button>
    </div>
  );
}
