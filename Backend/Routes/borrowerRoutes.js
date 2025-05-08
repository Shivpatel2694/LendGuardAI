const express = require('express');
const router = express.Router();
const BorrowerController = require('../controllers/borrowerController');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');


router.use(auth);

router.get('/', BorrowerController.getBorrowers);
router.post('/', BorrowerController.createBorrower);
router.get('/:id', BorrowerController.getBorrower);
router.put('/:id', BorrowerController.updateBorrower);
router.delete('/:id', BorrowerController.deleteBorrower);

module.exports = router;
