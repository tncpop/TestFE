'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaCoffee } from 'react-icons/fa';

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('กรุณากรอก Username และ Password');
      return;
    }

    try {
      const res = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (res?.error) setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      else if (res?.ok) window.location.href = '/';
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        overflow: 'hidden',
      }}
    >
      {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{error}</p>}

      <input
        placeholder="ชื่อผู้ใช้"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: '12px',
          fontSize: '15px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          outline: 'none',
          
        }}
      />

      <input
        placeholder="รหัสผ่าน"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: '12px',
          fontSize: '15px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          outline: 'none',
        }}
      />

      <button
        type="submit"
        style={{
          padding: '12px',
          fontSize: '16px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#c77b30',
          color: 'white',
          fontWeight: 600,
          cursor: 'pointer',
          transition: '0.3s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#a86526')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#c77b30')}
      >
        เข้าสู่ระบบ
      </button>

      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#5c4033' }}>
        ยังไม่มีบัญชี?{' '}
        <span
          style={{ color: '#c77b30', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => router.push('/register')}
        >
          สมัครสมาชิก
        </span>
      </p>
    </form>
  );
}
