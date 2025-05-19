const express = require('express');
const { registerUser, loginUser } = require('../controllers/auth');
const { getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/user');
const router = express.Router();

// Route untuk menambahkan pengguna
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getAllUsers);
router.get('/user/:id', getUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

module.exports = router;
