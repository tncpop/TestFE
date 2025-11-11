'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('กรุณากรอก username และ password');
      return;
    }

    console.log('📝 Login request:', { username, password });

    try {
      const res = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      console.log('📥 Login response:', res);

      if (res?.error) {
        setError('Username หรือ Password ไม่ถูกต้อง');
      } else if (res?.ok) {
        console.log('✅ Login success, redirecting...');
        window.location.href = '/';
      } else {
        setError('เกิดข้อผิดพลาดไม่ทราบสาเหตุ');
      }
    } catch (err) {
      console.error('❌ Login exception:', err);
      setError('เกิดข้อผิดพลาดในการ login');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'white',
          padding: '40px 30px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#0070f3' }}>
          Login
        </h2>
        {error && (
          <p style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{error}</p>
        )}
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            padding: '12px',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            padding: '12px',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '12px',
            fontSize: '16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#0070f3',
            color: 'white',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#005bb5')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0070f3')}
        >
          Login
        </button>
      </form>
    </div>
  );
}
