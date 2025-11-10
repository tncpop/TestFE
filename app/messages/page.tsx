"use client";

import { useEffect, useState } from 'react';
import { getExample, sendMessage, delMessage, updateMessage } from '../../services/api';
import { useRouter } from 'next/navigation';

export default function MessagesPage() {
  const router = useRouter(); // เรียก useRouter
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState('');

  const fetchMessages = async () => {
    const data = await getExample();
    setMessages(data);
  };

  const addMessage = async () => {
    if (!newMessage) return;
    await sendMessage(newMessage);
    setNewMessage('');
    fetchMessages();
  };

  const handleDelete = async (id: number) => {
    await delMessage(id);
    fetchMessages();
  };

  const handleUpdate = async (id: number) => {
    if (!editMessage) return;
    await updateMessage(id, editMessage);
    setEditId(null);
    setEditMessage('');
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const buttonStyle = {
    width: '70px',
    height: '35px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginLeft: '5px',
    transition: 'background-color 0.2s',
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Messages</h1>

      {messages.map((m) => (
        <div key={m.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {editId === m.id ? (
            <>
              <input
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', width: '200px' }}
              />
              <button
                onClick={() => handleUpdate(m.id)}
                style={{ ...buttonStyle, backgroundColor: '#52c41a', color: 'white' }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#73d13d')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#52c41a')}
              >
                Save
              </button>
              <button
                onClick={() => setEditId(null)}
                style={{ ...buttonStyle, backgroundColor: '#ccc', color: 'black' }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#aaa')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ccc')}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span>{m.message}</span>
              <button
                onClick={() => { setEditId(m.id); setEditMessage(m.message); }}
                style={{ ...buttonStyle, backgroundColor: '#1890ff', color: 'white' }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#40a9ff')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1890ff')}
              >
                แก้ไข
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                style={{ ...buttonStyle, backgroundColor: '#ff4d4f', color: 'white' }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#ff7875')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ff4d4f')}
              >
                ลบ
              </button>
            </>
          )}
        </div>
      ))}

      <div style={{ marginTop: '20px' }}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', width: '200px' }}
        />
        <button
          onClick={addMessage}
          style={{ ...buttonStyle, marginLeft: '5px', backgroundColor: '#1890ff', color: 'white' }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#40a9ff')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1890ff')}
        >
          Send
        </button>
      </div>
      <div style={{ marginTop: '50px' }}>
        <button onClick={() => router.push('/')}
          style={{ ...buttonStyle, backgroundColor: '#18ff18ff', color: 'white', width: '200px'}}
        >Back to Home
        </button>
      </div>
    </div>
  );
}
