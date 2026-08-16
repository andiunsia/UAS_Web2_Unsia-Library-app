import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('staff');
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');

    const fetchUsers = async () => {
        try {
            const { data } = await API.get('/users');
            setUsers(data);
        } catch (err) {
            console.error('Gagal memuat data user', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { name, email, role };
            if (password) {
                payload.password = password;
            }

            if (editingId) {
                await API.put(`/users/${editingId}`, payload);
                setMessage('User berhasil diperbarui!');
            } else {
                if (!password) {
                    alert('Password wajib diisi untuk user baru!');
                    return;
                }
                await API.post('/users', payload);
                setMessage('User berhasil ditambahkan!');
            }

            // Reset form
            setEditingId(null);
            setName('');
            setEmail('');
            setPassword('');
            setRole('staff');
            fetchUsers();
        } catch (err) {
            console.error('Gagal menyimpan user:', err);
            alert(err.response?.data?.message || 'Terjadi kesalahan');
        }
    };

    const handleEdit = (user) => {
        setEditingId(user._id);
        setName(user.name);
        setEmail(user.email);
        setRole(user.role || 'staff');
        setPassword('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus user ini?')) {
            try {
                await API.delete(`/users/${id}`);
                fetchUsers();
            } catch (err) {
                console.error('Gagal menghapus user', err);
            }
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setName('');
        setEmail('');
        setPassword('');
        setRole('staff');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Manajemen Data Pengguna (User)</h2>
                <Link to="/">
                    <button style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                        Kembali ke Dashboard
                    </button>
                </Link>
            </div>

            {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}

            {/* Form Input / Edit User */}
            <div style={{ background: '#f8f9fa', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '30px' }}>
                <h3>{editingId ? 'Edit Data User' : 'Tambah User Baru'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
                    <div>
                        <label>Nama Lengkap:</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
                        />
                    </div>
                    <div>
                        <label>Password {editingId && '(Kosongkan jika tidak ingin mengubah password)'}:</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            {...(!editingId && { required: true })}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
                        />
                    </div>
                    <div>
                        <label>Role:</label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)} 
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        >
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" style={{ background: '#28a745', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                            {editingId ? 'Update User' : 'Simpan User'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={handleCancel} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                                Batal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Tabel Daftar User */}
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                <thead>
                    <tr style={{ background: '#6f42c1', color: '#fff' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nama</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user._id}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textTransform: 'capitalize' }}>{user.role}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                                    <button onClick={() => handleEdit(user)} style={{ background: '#ffc107', border: 'none', padding: '5px 10px', marginRight: '5px', borderRadius: '3px', cursor: 'pointer' }}>Edit</button>
                                    <button onClick={() => handleDelete(user._id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Hapus</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Belum ada data user.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}