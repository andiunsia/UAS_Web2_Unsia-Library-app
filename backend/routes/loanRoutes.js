const express = require('express');
const router = express.Router();
const { getLoans, createLoan, returnLoan } = require('../controllers/loanController');

router.route('/').get(getLoans).post(createLoan);
router.route('/:id/return').put(returnLoan);

module.exports = router;