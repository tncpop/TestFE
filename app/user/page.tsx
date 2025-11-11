'use client';

import { createUser, deleteUser, getUsers, updateUser } from '@/services/api/user';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

interface User {
  id: number;
  username: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;
    try {
      await createUser(newUsername, newPassword);
      setNewUsername('');
      setNewPassword('');
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Error');
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditUsername(user.username);
    setEditPassword('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditUsername('');
    setEditPassword('');
  };

  const handleSave = async (id: number) => {
    try {
      await updateUser(id, editUsername, editPassword || undefined);
      handleCancel();
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('ลบ user จริงหรือไม่?')) return;
    await deleteUser(id);
    fetchUsers();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>User Management</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* Add user form */}
      <form onSubmit={handleAdd} style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '10px' }}>
        <input
          placeholder="Username"
          value={newUsername}
          onChange={e => setNewUsername(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', flex: '1' }}
        />
        <input
          placeholder="Password"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', flex: '1' }}
        />
        <button type="submit" style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: 'pointer' }}>
          Add
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#0070f3', color: 'white', textAlign: 'center', height: '45px' }}>
            <th style={{ width: '10%', padding: '10px', borderRight: '1px solid #005bb5' }}>ID</th>
            <th style={{ width: '50%', padding: '10px', borderRight: '1px solid #005bb5' }}>Username</th>
            <th style={{ width: '40%', padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #ddd', textAlign: 'center', height: '45px' }}>
              <td>{u.id}</td>
              <td>
                {editingId === u.id ? (
                  <input
                    value={editUsername}
                    onChange={e => setEditUsername(e.target.value)}
                    style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '90%' }}
                  />
                ) : (
                  u.username
                )}
              </td>
              <td>
                {editingId === u.id ? (
                  <>
                    <FaCheck onClick={() => handleSave(u.id)} style={{ cursor: 'pointer', marginRight: '10px', color: 'green' }} title="Save" />
                    <FaTimes onClick={handleCancel} style={{ cursor: 'pointer', color: 'red' }} title="Cancel" />
                  </>
                ) : (
                  <>
                    <FaEdit onClick={() => handleEdit(u)} style={{ cursor: 'pointer', marginRight: '10px', color: '#ffa500' }} title="Edit" />
                    <FaTrash onClick={() => handleDelete(u.id)} style={{ cursor: 'pointer', color: '#ff4d4f' }} title="Delete" />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
