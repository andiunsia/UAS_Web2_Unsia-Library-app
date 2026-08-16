const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Judul buku wajib diisi']
        },
        bookId: { 
        type: String, 
        required: [true, 'ID buku wajib diisi'],
        unique: true

        },
        author: {
            type: String,
            required: [true, 'Penulis buku wajib diisi']
        },
        category: {
            type: String,
            required: [true, 'Kategori buku wajib diisi']
        },
        stock: {
            type: Number,
            required: [true, 'Stok buku wajib diisi'],
            min: [0, 'Stok tidak boleh kurang dari 0']
        },
        availableStock: {
            type: Number,
            required: [true, 'Stok tersedia wajib diisi']
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);