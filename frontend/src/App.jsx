import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Loans from './pages/Loans';
import Users from './pages/Users';
import Login from './pages/Login';
import Register from './pages/Register'; // 1. Impor halaman Register

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> {/* 2. Tambahkan rute ini */}
                <Route path="/books" element={<Books />} />
                <Route path="/members" element={<Members />} />
                <Route path="/loans" element={<Loans />} />
                <Route path="/users" element={<Users />} />
            </Routes>
        </Router>
    );
}

export default App;