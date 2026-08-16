const express = require('express');
const router = express.Router();
const { getMembers, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware'); 

router.route('/')
    .get(protect, getMembers)
    .post(protect, createMember);

router.route('/:id')
    .put(protect, updateMember)     // <-- Rute untuk Update
    .delete(protect, deleteMember); // Rute untuk Delete

module.exports = router;