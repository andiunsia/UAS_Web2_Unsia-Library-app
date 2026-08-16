const Loan = require('../models/Loan');
const Book = require('../models/Book');
const Member = require('../models/Member'); 

const getLoans = async (req, res) => {
    try {
        const loans = await Loan.find({})
            .populate('book', 'bookId title author category') 
            .populate('member', 'name email'); 
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const createLoan = async (req, res) => {
    try {
        const { bookId, memberId, dueDate } = req.body; // Sesuaikan dengan key dari frontend

        if (!bookId || !memberId || !dueDate) {
            return res.status(400).json({ message: 'Book ID, Member ID, dan Tanggal Jatuh Tempo wajib diisi' });
        }

        // Cari buku menggunakan bookId (string), bukan findById
        const bookData = await Book.findOne({ bookId: bookId });
        
        if (!bookData) {
            return res.status(404).json({ message: 'Buku tidak ditemukan' });
        }

        if (bookData.availableStock <= 0) {
            return res.status(400).json({ message: 'Stok buku habis, tidak dapat dipinjam' });
        }

        // Buat data peminjaman
        const loan = await Loan.create({
            book: bookData._id, // Hubungkan dengan ObjectId asli buku
            member: memberId,   // Sesuaikan dengan skema Anda
            dueDate,
            status: 'Dipinjam'
        });

        // Kurangi stok
        bookData.availableStock -= 1;
        await bookData.save();

        res.status(201).json({ message: 'Peminjaman berhasil dicatat', loan });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const returnLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({ message: 'Data peminjaman tidak ditemukan' });
        }

        if (loan.status === 'Dikembalikan') {
            return res.status(400).json({ message: 'Buku ini sudah dikembalikan' });
        }

        loan.status = 'Dikembalikan';
        loan.returnDate = Date.now();
        await loan.save();

        // Cari buku untuk menambah stok kembali
        const bookData = await Book.findById(loan.book);
        if (bookData) {
            bookData.availableStock += 1;
            await bookData.save();
        }

        res.status(200).json({ message: 'Buku berhasil dikembalikan', loan });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getLoans,
    createLoan,
    returnLoan
};