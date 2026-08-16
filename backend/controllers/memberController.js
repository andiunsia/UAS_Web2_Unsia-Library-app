const Member = require('../models/Member');

// @desc    Mendapatkan seluruh data anggota
const getMembers = async (req, res) => {
    try {
        const members = await Member.find({}).sort({ createdAt: -1 });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Menambahkan data anggota baru
const createMember = async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Nama dan Email wajib diisi' });
        }

        // Cari data anggota terakhir berdasarkan memberID atau memberId
        const lastMember = await Member.findOne().sort({ _id: -1 });
        let nextIdNumber = 1;
        
        const lastIdValue = lastMember ? (lastMember.memberID || lastMember.memberId) : null;
        
        if (lastIdValue) {
            const numericPart = parseInt(lastIdValue.replace('M', ''), 10);
            if (!isNaN(numericPart)) {
                nextIdNumber = numericPart + 1;
            }
        }
        
        const generatedId = 'M' + String(nextIdNumber).padStart(3, '0');

        // Masukkan ke memberID dan memberId agar sesuai dengan skema database
        const member = await Member.create({
            memberID: generatedId,
            memberId: generatedId,
            name,
            email,
            phone
        });

        res.status(201).json(member);
    } catch (error) {
        console.error("DETAIL ERROR CREATE MEMBER:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email atau ID Member sudah terdaftar' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Memperbarui data anggota
const updateMember = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const member = await Member.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ message: 'Anggota tidak ditemukan' });
        }

        member.name = name || member.name;
        member.email = email || member.email;
        member.phone = phone !== undefined ? phone : member.phone;

        const updatedMember = await member.save();
        res.status(200).json({ message: 'Anggota berhasil diperbarui', updatedMember });
    } catch (error) {
        console.error("DETAIL ERROR UPDATE MEMBER:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email sudah terdaftar pada anggota lain' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Menghapus data anggota
const deleteMember = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ message: 'Anggota tidak ditemukan' });
        }

        await member.deleteOne();
        res.status(200).json({ message: 'Anggota berhasil dihapus' });
    } catch (error) {
        console.error("DETAIL ERROR DELETE MEMBER:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Menambahkan user baru
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nama, Email, dan Password wajib diisi' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        const user = await User.create({
            name,
            email,
            password, // Catatan: Jika model Anda menggunakan hashing pre-save, password akan otomatis ter-hash
            role: role || 'admin'
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getMembers,
    createMember,
    updateMember,
    deleteMember,
    createUser
};