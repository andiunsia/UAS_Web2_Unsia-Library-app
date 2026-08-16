const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Mengecek apakah header request memiliki Authorization dengan format Bearer <token>
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Mengambil token dari string "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Verifikasi token menggunakan secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Menyimpan data user ke dalam req.user (tanpa password)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Lanjut ke controller tujuan
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Tidak diotorisasi, token gagal atau kedaluwarsa' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Tidak diotorisasi, tidak ada token yang dikirim' });
    }
};

module.exports = { protect };