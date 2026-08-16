import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Members() {
    const [members, setMembers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [editId, setEditId] = useState(null); 
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const fetchMembers = async () => {
        try {
            const { data } = await API.get('/members');
            setMembers(data);
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editId) {
                // Mode Update
                await API.put(`/members/${editId}`, { name, email, phone });
                setSuccess('Anggota berhasil diperbarui!');
            } else {
                // Mode Tambah Baru
                await API.post('/members', { name, email, phone });
                setSuccess('Anggota berhasil ditambahkan!');
            }

            // Reset Form & State
            setName('');
            setEmail('');
            setPhone('');
            setEditId(null);
            fetchMembers();
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan');
        }
    };

    const handleEditClick = (member) => {
        setEditId(member._id);
        setName(member.name);
        setEmail(member.email);
        setPhone(member.phone || '');
        setError('');
        setSuccess('');
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setName('');
        setEmail('');
        setPhone('');
    };

    const handleDeleteMember = async (id) => {
        if (window.confirm('Yakin ingin menghapus anggota ini?')) {
            try {
                await API.delete(`/members/${id}`);
                fetchMembers();
            } catch (err) {
                alert(err.response?.data?.message || 'Gagal menghapus anggota');
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Manajemen Data Anggota (Members)</h2>
                <Link to="/" style={{ padding: '8px 15px', background: '#6c757d', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
                    Kembali ke Dashboard
                </Link>
            </div>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

            {/* Form Tambah / Edit Anggota */}
            <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
                <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>
                    {editId ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '15px' }}>
                    <input 
                        type="text" 
                        placeholder="Nama Lengkap" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        style={{ padding: '8px' }} 
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ padding: '8px' }} 
                    />
                    <input 
                        type="text" 
                        placeholder="No. Telepon / HP" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        style={{ padding: '8px' }} 
                    />
                </div>

                <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button type="submit" style={{ padding: '10px 20px', background: editId ? '#ffc107' : '#28a745', color: editId ? '#000' : '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {editId ? 'Update Anggota' : 'Simpan Anggota'}
                    </button>
                    {editId && (
                        <button type="button" onClick={handleCancelEdit} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Batal
                        </button>
                    )}
                </div>
            </form>

            {/* Tabel Daftar Anggota */}
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                <thead>
                    <tr style={{ background: '#343a40', color: '#fff' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nama</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Telepon</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {members.length > 0 ? (
                        members.map((m) => (
                            <tr key={m._id}>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{m.memberID || m.memberId || m._id.slice(-4)}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{m.name}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{m.email}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{m.phone || '-'}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                                    <button 
                                        onClick={() => handleEditClick(m)} 
                                        style={{ padding: '5px 10px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteMember(m._id)} 
                                        style={{ padding: '5px 10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ padding: '15px', textAlign: 'center' }}>Belum ada data anggota</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}