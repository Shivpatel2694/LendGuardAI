// routes/mockDataRouter.js
const express = require('express');
const router = express.Router();
const { generateMockDataController } = require('../controllers/mockDataController');
const auth = require('../middleware/auth');

// POST /api/generate-mock-data
router.post('/generate-mock-data',auth, generateMockDataController);

module.exports = router;
