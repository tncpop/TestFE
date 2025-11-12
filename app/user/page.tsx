'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { createUser, deleteUser, getUsers, updateUser } from '@/services/api/user';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
}

export default function UsersPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'user'>('user');

  const [error, setError] = useState('');
  const [accessDenied, setAccessDenied] = useState(false);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  // ตรวจสอบสิทธิ์ admin
  useEffect(() => {
    if (session === undefined) return;
    if (session && session.user.role !== 'admin') {
      setAccessDenied(true);
      setTimeout(() => router.push('/'), 3000);
    }
  }, [session, router]);

  useEffect(() => {
    if (session && session.user.role === 'admin') {
      fetchUsers();
    }
  }, [session]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      setError('กรุณากรอก Username และ Password');
      return;
    }
    try {
      await createUser(newUsername, newPassword, newRole);
      setNewUsername('');
      setNewPassword('');
      setNewRole('user');
      setError('');
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditUsername(user.username);
    setEditPassword('');
    setEditRole(user.role);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditUsername('');
    setEditPassword('');
    setEditRole('user');
    setError('');
  };

  const handleSave = async (id: number) => {
    if (!editUsername || !editRole) {
      setError('กรุณากรอก Username และ Role');
      return;
    }
    try {
      await updateUser(id, editUsername, editPassword || undefined, editRole);
      handleCancel();
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('ลบ user จริงหรือไม่?')) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด');
    }
  };

  if (session === undefined) return <p>Loading...</p>;
  if (accessDenied) return <p style={{ color: '#e74c3c', textAlign: 'center' }}>คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>;

  return (
    <div style={{
      padding: '30px',
      fontFamily: 'Prompt, sans-serif',
      backgroundColor: '#fffaf6',
      minHeight: '100vh',
    }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#c77b30', marginBottom: '20px', textAlign: 'left' }}>จัดการผู้ใช้งาน</h2>

      {error && <p style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

      {/* Form เพิ่ม User */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input placeholder="Username" value={newUsername} onChange={e => setNewUsername(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', flex: '1 0 150px' }} />
        <input placeholder="Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', flex: '1 0 150px' }} />
        <select value={newRole} onChange={e => setNewRole(e.target.value as 'admin' | 'user')}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: '#27ae60',
          color: '#fff',
          fontWeight: 600,
          cursor: 'pointer',
        }}>เพิ่ม</button>
      </form>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0e0d0', textAlign: 'center' }}>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>ID</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Username</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Role</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ textAlign: 'center', borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{u.id}</td>
              <td style={{ padding: '10px' }}>
                {editingId === u.id
                  ? <input value={editUsername} onChange={e => setEditUsername(e.target.value)}
                      style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '90%' }} />
                  : u.username
                }
              </td>
              <td style={{ padding: '10px' }}>
                {editingId === u.id
                  ? <select value={editRole} onChange={e => setEditRole(e.target.value as 'admin' | 'user')}
                      style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '90%' }}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  : u.role
                }
              </td>
              <td style={{ padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  {editingId === u.id ? (
                    <>
                      <FaCheck onClick={() => handleSave(u.id)} style={{ cursor: 'pointer', color: '#27ae60' }} title="Save" />
                      <FaTimes onClick={handleCancel} style={{ cursor: 'pointer', color: '#e74c3c' }} title="Cancel" />
                    </>
                  ) : (
                    <>
                      <FaEdit onClick={() => handleEdit(u)} style={{ cursor: 'pointer', color: '#2980b9' }} title="Edit" />
                      <FaTrash onClick={() => handleDelete(u.id)} style={{ cursor: 'pointer', color: '#e74c3c' }} title="Delete" />
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
