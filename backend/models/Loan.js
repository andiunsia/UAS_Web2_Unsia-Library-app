const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
            required: true
        },
        loanDate: {
            type: Date,
            default: Date.now
        },
        dueDate: {
            type: Date,
            required: [true, 'Tanggal jatuh tempo wajib diisi']
        },
        returnDate: {
            type: Date
        },
        status: {
            type: String,
            enum: ['Dipinjam', 'Dikembalikan'],
            default: 'Dipinjam'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Loan', loanSchema);