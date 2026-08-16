const Book = require('../models/Book');

// @desc    Mendapatkan seluruh data buku
// @route   GET /api/books
// @access  Protected
const getBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Menambahkan data buku baru
// @route   POST /api/books
// @access  Protected
const createBook = async (req, res) => {
    try {
        const { bookId, title, author, category, stock } = req.body;

        // Validasi input: pastikan semua kolom terisi termasuk bookId
        if (!bookId || !title || !author || !category || stock === undefined || stock === '') {
            return res.status(400).json({ message: 'Semua kolom wajib diisi termasuk ID buku' });
        }

        // Simpan data termasuk bookId dan availableStock
        const book = await Book.create({
            bookId,
            title,
            author,
            category,
            stock,
            availableStock: stock
        });

        res.status(201).json(book);
    } catch (error) {
        // Jika bookId kembar
        if (error.code === 11000) {
            return res.status(400).json({ message: 'ID Buku sudah terdaftar, gunakan ID lain' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Memperbarui data buku berdasarkan ID
// @route   PUT /api/books/:id
// @access  Protected
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Buku tidak ditemukan' });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Menghapus data buku berdasarkan ID
// @route   DELETE /api/books/:id
// @access  Protected
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Buku tidak ditemukan' });
        }

        await book.deleteOne();
        res.status(200).json({ message: 'Buku berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getBooks,
    createBook,
    updateBook,
    deleteBook
};