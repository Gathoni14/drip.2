import express from 'express';

import { registerUser, loginUser } from '../controller/userController.js';

const router = express.Router();

// @route POST /api/users/register
// @desc Register a new user

router.post('/register', registerUser);


// @route POST /api/users/login
// authenticate a user & get token
// @access Public
// @desc Login a user
router.post('/login', loginUser);

export default router;