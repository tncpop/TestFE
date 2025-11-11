'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // App Router
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
    if (session === undefined) return; // รอโหลด session
    if (session && session.user.role !== 'admin') {
      setAccessDenied(true); // แสดงข้อความว่าไม่มีสิทธิ์
       setTimeout(() => {
      router.push('/'); // redirect non-admins หลัง 4 วินาที
    }, 3000); // 
    }
  }, [session, router]);

  // Fetch users สำหรับ admin เท่านั้น
  useEffect(() => {
    if (session && session.user.role === 'admin') {
      fetchUsers();
    }
  }, [session]);

  // Add new user
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
      setError(err.message || 'Error');
    }
  };

  // Edit user
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
      setError(err.message || 'Error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('ลบ user จริงหรือไม่?')) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Error');
    }
  };

  if (session === undefined) return <p>Loading...</p>;
  if (accessDenied) return <p style={{ color: 'red', textAlign: 'center' }}>คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>User Management</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleAdd} style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '10px' }}>
        <input placeholder="Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', flex: '1' }} />
        <input placeholder="Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', flex: '1' }} />
        <select value={newRole} onChange={e => setNewRole(e.target.value as 'admin' | 'user')} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: 'pointer' }}>Add</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#0070f3', color: 'white', textAlign: 'center', height: '45px' }}>
            <th style={{ width: '10%', padding: '10px', borderRight: '1px solid #005bb5' }}>ID</th>
            <th style={{ width: '40%', padding: '10px', borderRight: '1px solid #005bb5' }}>Username</th>
            <th style={{ width: '20%', padding: '10px', borderRight: '1px solid #005bb5' }}>Role</th>
            <th style={{ width: '30%', padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #ddd', textAlign: 'center', height: '45px' }}>
              <td>{u.id}</td>
              <td>{editingId === u.id ? <input value={editUsername} onChange={e => setEditUsername(e.target.value)} style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '90%' }} /> : u.username}</td>
              <td>{editingId === u.id ? <select value={editRole} onChange={e => setEditRole(e.target.value as 'admin' | 'user')} style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '90%' }}><option value="user">User</option><option value="admin">Admin</option></select> : u.role}</td>
              <td>{editingId === u.id ? <>
                <FaCheck onClick={() => handleSave(u.id)} style={{ cursor: 'pointer', marginRight: '10px', color: 'green' }} title="Save" />
                <FaTimes onClick={handleCancel} style={{ cursor: 'pointer', color: 'red' }} title="Cancel" />
              </> : <>
                <FaEdit onClick={() => handleEdit(u)} style={{ cursor: 'pointer', marginRight: '10px', color: '#ffa500' }} title="Edit" />
                <FaTrash onClick={() => handleDelete(u.id)} style={{ cursor: 'pointer', color: '#ff4d4f' }} title="Delete" />
              </>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
