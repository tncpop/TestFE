'use client';
import React from 'react';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'fixed', // ครอบทั้ง viewport
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        fontFamily: 'Prompt, sans-serif',
        background: 'linear-gradient(135deg, #fff7f0 0%, #f2e0c9 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start', // เริ่มจากบน
        paddingTop: '50px',
        overflow: 'hidden', // ป้องกัน scroll
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '40px 35px',
          borderRadius: '14px',
          boxShadow: '0 8px 18px rgba(0,0,0,0.15)',
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          margin: 225,
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        {children}
      </div>
    </div>
  );
}
