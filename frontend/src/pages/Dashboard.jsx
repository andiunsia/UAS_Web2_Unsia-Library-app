import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard() {
    const [summary, setSummary] = useState({
        totalBooks: 0,
        totalMembers: 0,
        totalLoans: 0,
        jumlahBukuTersedia: 0,
        categoryLabels: [],
        categoryData: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const { data } = await API.get('/dashboard/summary');
                setSummary(data);
            } catch (err) {
                console.error('Gagal memuat ringkasan dashboard', err);
            }
        };
        fetchSummary();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    // Konfigurasi Data untuk Chart.js (Grafik Jumlah Buku per Kategori)
    const chartData = {
        labels: summary.categoryLabels.length > 0 ? summary.categoryLabels : ['Belum Ada Kategori'],
        datasets: [
            {
                label: 'Jumlah Buku per Kategori',
                data: summary.categoryData.length > 0 ? summary.categoryData : [0],
                backgroundColor: [
                    'rgba(0, 123, 255, 0.6)',
                    'rgba(40, 167, 69, 0.6)',
                    'rgba(255, 193, 7, 0.6)',
                    'rgba(220, 53, 69, 0.6)',
                    'rgba(111, 66, 193, 0.6)'
                ],
                borderColor: [
                    'rgba(0, 123, 255, 1)',
                    'rgba(40, 167, 69, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(220, 53, 69, 1)',
                    'rgba(111, 66, 193, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Grafik Jumlah Buku Berdasarkan Kategori'
            }
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Dashboard - UNSIA Digital Library</h2>
                <button 
                    onClick={handleLogout} 
                    style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Logout
                </button>
            </div>

            {/* Menu Navigasi */}
            <div style={{ margin: '20px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link to="/books"><button style={{ padding: '10px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Kelola Buku</button></Link>
                <Link to="/members"><button style={{ padding: '10px 15px', background: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Kelola Anggota</button></Link>
                <Link to="/loans"><button style={{ padding: '10px 15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Kelola Peminjaman</button></Link>
                <Link to="/users"><button style={{ padding: '10px 15px', background: '#6f42c1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Kelola User</button></Link>
            </div>

            {/* 4 Kartu Ringkasan Sesuai Syarat */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div style={{ padding: '20px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
                    <h4>Total Buku</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0' }}>{summary.totalBooks}</p>
                </div>
                <div style={{ padding: '20px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
                    <h4>Total Anggota</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0' }}>{summary.totalMembers}</p>
                </div>
                <div style={{ padding: '20px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
                    <h4>Total Peminjaman</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0' }}>{summary.totalLoans}</p>
                </div>
                <div style={{ padding: '20px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
                    <h4>Jumlah Buku Tersedia</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0' }}>{summary.jumlahBukuTersedia}</p>
                </div>
            </div>

            {/* Tampilan Grafik Chart.js (Jumlah Buku per Kategori) */}
            <div style={{ marginTop: '30px', padding: '20px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}