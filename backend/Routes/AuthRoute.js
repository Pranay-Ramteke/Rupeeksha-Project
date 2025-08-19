// backend/Routes/AuthRoute.js

const { Signup, Login } = require('../Controllers/AuthController');
const { userVerification } = require('../Middlewares/AuthMiddleware');
const express = require('express');

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/', userVerification);

module.exports = router;
