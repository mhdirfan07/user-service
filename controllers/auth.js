const { addUser, getUserByEmail } = require('../models/auth');
const bcrypt = require('bcrypt'); // Untuk hashing password
const SALT_ROUNDS = 10; // Jumlah putaran untuk bcrypt
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Untuk mengambil variabel lingkungan dari file .env

// Fungsi untuk menangani penambahan pengguna
async function registerUser(req, res) {
  const { name, email, password, role, address, phone_number } = req.body; // Mendapatkan data dari request body

  // Validasi input
  if (!name || !email || !password || !role) {
    return res.status(400).send({ message: 'Name, email, password, and role are required.' });
  }

  // Hashing password sebelum menyimpannya
  
  try {
    // Verifikasi apakah email sudah terdaftar
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).send({ message: 'Email is already in use. Please choose another one.' });
    }

    // Hashing password sebelum menyimpannya
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS); // Hash password dengan bcrypt
    
    // Membuat objek data pengguna yang akan disimpan
    const userData = {
      name,
      email,
      password: hashedPassword,  // Simpan password yang sudah di-hash
      address,
      phone_number,
      role,
      createdAt: new Date(),
    };
    // Menambahkan pengguna ke Firestore melalui model
    const userId = await addUser(userData); // Fungsi ini ada di authModel.js untuk menyimpan data ke Firestore
    
    // Jika berhasil, kirimkan response sukses
    res.status(201).send({ message: 'User added successfully', userId });
  } catch (error) {
    // Tangani error jika terjadi
    console.error('Error while adding user:', error);
    res.status(500).send({ message: 'Server error, please try again later.' });
  }
}

// Fungsi untuk menangani login pengguna
async function loginUser(req, res) {
  const { email, password } = req.body; // Mendapatkan email dan password dari request body

  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required.' });
  }

  try {
    // Mencari pengguna berdasarkan email
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    // Memverifikasi password menggunakan bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid password.' });
    }

    // Membuat token JWT dengan payload yang berisi id dan role pengguna
    const token = jwt.sign(
      { userId: user.id, role: user.role }, // Payload (data yang disertakan dalam token)
      process.env.JWT_TOKEN, // Kunci untuk menandatangani token
      { expiresIn: '2h' } // Token kadaluarsa dalam 1 jam
    );

    // console.log(userId);
    
    // Kirimkan respons sukses dengan token
    res.status(200).send({
      message: 'Login successful',
      token: token, // Kirimkan token JWT
    });

  } catch (error) {
    console.error('Error while logging in:', error);
    res.status(500).send({ message: 'Server error, please try again later.' });
  }
}

module.exports = { registerUser, loginUser };
