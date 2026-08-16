import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Loans() {
    const [loans, setLoans] = useState([]);
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    
    // State form input
    const [bookId, setBookId] = useState('');
    const [memberId, setMemberId] = useState('');
    const [dueDate, setDueDate] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const loansRes = await API.get('/loans');
            const booksRes = await API.get('/books');
            const membersRes = await API.get('/members');
            
            setLoans(loansRes.data);
            setBooks(booksRes.data);
            setMembers(membersRes.data);
        } catch (err) {
            if (err.response?.status === 401) navigate('/login');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddLoan = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await API.post('/loans', {
                bookId,
                memberId,
                dueDate
            });

            setSuccess('Peminjaman berhasil dicatat!');
            setBookId('');
            setMemberId('');
            setDueDate('');
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mencatat peminjaman');
        }
    };

    // Fungsi untuk memproses pengembalian buku
    const handleReturn = async (id) => {
        setError('');
        setSuccess('');
        try {
            await API.put(`/loans/${id}/return`);
            setSuccess('Buku berhasil dikembalikan!');
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memproses pengembalian buku');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Manajemen Data Peminjaman (Loans)</h2>
                <Link to="/" style={{ padding: '8px 15px', background: '#6c757d', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>Kembali ke Dashboard</Link>
            </div>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

            {/* Form Catat Peminjaman Baru */}
            <form onSubmit={handleAddLoan} style={{ background: '#f8f9fa', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
                <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Catat Peminjaman Baru</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '15px' }}>
                    {/* Pilih Buku */}
                    <select value={bookId} onChange={(e) => setBookId(e.target.value)} required style={{ padding: '8px' }}>
                        <option value="">-- Pilih Buku --</option>
                        {books.map((b) => (
                            <option key={b._id} value={b.bookId || b._id}>
                                {b.title} (Stok: {b.availableStock ?? b.stock})
                            </option>
                        ))}
                    </select>

                    {/* Pilih Anggota */}
                    <select value={memberId} onChange={(e) => setMemberId(e.target.value)} required style={{ padding: '8px' }}>
                        <option value="">-- Pilih Anggota --</option>
                        {members.map((m) => (
                            <option key={m._id} value={m._id}>
                                {m.name} ({m.email})
                            </option>
                        ))}
                    </select>

                    {/* Input Tanggal Jatuh Tempo */}
                    <input 
                        type="date" 
                        value={dueDate} 
                        onChange={(e) => setDueDate(e.target.value)} 
                        required 
                        style={{ padding: '8px' }} 
                        placeholder="Tanggal Jatuh Tempo"
                    />
                </div>

                <div style={{ textAlign: 'center' }}>
                    <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Simpan Peminjaman
                    </button>
                </div>
            </form>

            {/* Tabel Daftar Peminjaman */}
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                <thead>
                    <tr style={{ background: '#343a40', color: '#fff' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Buku</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Anggota</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Jatuh Tempo</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {loans.length > 0 ? (
                        loans.map((loan) => (
                            <tr key={loan._id}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{loan.book?.title || loan.bookId}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{loan.member?.name || loan.memberId}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : '-'}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', color: loan.status === 'Dikembalikan' ? 'green' : 'orange', fontWeight: 'bold' }}>
                                    {loan.status}
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                                    {loan.status === 'Dipinjam' ? (
                                        <button 
                                            onClick={() => handleReturn(loan._id)}
                                            style={{ 
                                                background: '#28a745', 
                                                color: '#fff', 
                                                border: 'none', 
                                                padding: '5px 10px', 
                                                borderRadius: '4px', 
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Kembalikan
                                        </button>
                                    ) : (
                                        <span style={{ fontSize: '12px', color: '#28a745', fontWeight: 'bold' }}>Selesai</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ padding: '15px', textAlign: 'center' }}>Belum ada data peminjaman</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}