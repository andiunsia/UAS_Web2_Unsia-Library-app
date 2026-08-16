const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
    {
        memberID: {
            type: String,
            required: [true, 'ID Member wajib diisi'],
            unique: true,
            trim: true
        },
        name: {
            type: String,
            required: [true, 'Nama member wajib diisi'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email wajib diisi'],
            unique: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Nomor telepon wajib diisi'],
            trim: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Member', memberSchema);