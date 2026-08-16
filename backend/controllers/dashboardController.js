const Book = require('../models/Book');
const Member = require('../models/Member');
const Loan = require('../models/Loan');
const User = require('../models/User');

// @desc    Get dashboard summary counts and category stats
const getDashboardSummary = async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments();
        const totalMembers = await Member.countDocuments();
        const totalLoans = await Loan.countDocuments();

        // Hitung jumlah buku tersedia (total keseluruhan stok dari semua buku)
        const books = await Book.find({});
        const jumlahBukuTersedia = books.reduce((acc, book) => {
            const val = book.stock !== undefined ? book.stock : (book.stok !== undefined ? book.stok : 0);
            return acc + (parseInt(val) || 0);
        }, 0);

        // Hitung jumlah buku per kategori untuk grafik Chart.js
        const categoryMap = {};
        books.forEach(book => {
            const cat = book.category || book.kategori || 'Lainnya';
            categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        });

        const categoryLabels = Object.keys(categoryMap);
        const categoryData = Object.values(categoryMap);

        res.json({
            totalBooks,
            totalMembers,
            totalLoans,
            jumlahBukuTersedia,
            categoryLabels,
            categoryData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardSummary
};