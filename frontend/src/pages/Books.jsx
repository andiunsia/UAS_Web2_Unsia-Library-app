import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Books() {
    const [books, setBooks] = useState([]);
    const [bookId, setBookId] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [editId, setEditId] = useState(null); // Melacak ID buku yang sedang diedit
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const fetchBooks = async () => {
        try {
            const { data } = await API.get('/books');
            setBooks(data);
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editId) {
                // Mode Update
                await API.put(`/books/${editId}`, { bookId, title, author, category, stock });
                setSuccess('Buku berhasil diperbarui!');
            } else {
                // Mode Tambah Baru
                await API.post('/books', { bookId, title, author, category, stock });
                setSuccess('Buku berhasil ditambahkan!');
            }

            // Reset Form
            setBookId('');
            setTitle('');
            setAuthor('');
            setCategory('');
            setStock('');
            setEditId(null);
            fetchBooks();
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan');
        }
    };

    const handleEditClick = (book) => {
        setEditId(book._id);
        setBookId(book.bookId || '');
        setTitle(book.title || '');
        setAuthor(book.author || '');
        setCategory(book.category || '');
        setStock(book.stock !== undefined ? book.stock : '');
        setError('');
        setSuccess('');
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setBookId('');
        setTitle('');
        setAuthor('');
        setCategory('');
        setStock('');
    };

    const handleDeleteBook = async (id) => {
        if (window.confirm('Yakin ingin menghapus buku ini?')) {
            try {
                await API.delete(`/books/${id}`);
                fetchBooks();
            } catch (err) {
                alert(err.response?.data?.message || 'Gagal menghapus buku');
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Manajemen Data Buku</h2>
                <Link to="/" style={{ padding: '8px 15px', background: '#6c757d', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
                    Kembali ke Dashboard
                </Link>
            </div>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

            {/* Form Tambah / Edit Buku */}
            <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
                <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>
                    {editId ? 'Edit Data Buku' : 'Tambah Buku Baru'}
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="ID Buku (Contoh: B001)" 
                        value={bookId} 
                        onChange={(e) => setBookId(e.target.value)} 
                        required 
                        style={{ padding: '8px' }} 
                    />
                    <input 
                        type="text" 
                        placeholder="Judul Buku" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        style={{ padding: '8px' }} 
                    />
                    <input 
                        type="text" 
                        placeholder="Penulis" 
                        value={author} 
                        onChange={(e) => setAuthor(e.target.value)} 
                        style={{ padding: '8px' }} 
                    />
                    <input 
                        type="text" 
                        placeholder="Kategori" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        style={{ padding: '8px' }} 
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <input 
                        type="number" 
                        placeholder="Stok" 
                        value={stock} 
                        onChange={(e) => setStock(e.target.value)} 
                        style={{ padding: '8px', width: '100%' }} 
                    />
                </div>

                <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button type="submit" style={{ padding: '10px 20px', background: editId ? '#ffc107' : '#28a745', color: editId ? '#000' : '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {editId ? 'Update Buku' : 'Simpan Buku'}
                    </button>
                    {editId && (
                        <button type="button" onClick={handleCancelEdit} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Batal
                        </button>
                    )}
                </div>
            </form>

            {/* Tabel Daftar Buku */}
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                <thead>
                    <tr style={{ background: '#007bff', color: '#fff' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID Buku</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Judul</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Penulis</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Kategori</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Stok</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {books.length > 0 ? (
                        books.map((b) => (
                            <tr key={b._id}>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{b.bookId}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{b.title}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{b.author || '-'}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{b.category || '-'}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{b.stock}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                                    <button 
                                        onClick={() => handleEditClick(b)} 
                                        style={{ padding: '5px 10px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteBook(b._id)} 
                                        style={{ padding: '5px 10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ padding: '15px', textAlign: 'center' }}>Belum ada data buku</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}