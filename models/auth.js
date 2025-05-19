const db = require('../firebaseConfig'); // Mengimpor db yang sudah dikonfigurasi

// Fungsi untuk menambahkan data pengguna ke koleksi 'users'
async function addUser(userData) {
  try {
    const userRef = db.collection('users').doc(); // Membuat dokumen baru dengan ID otomatis
    await userRef.set(userData);  // Menambahkan data pengguna
    return userRef.id; // Mengembalikan ID dokumen
  } catch (error) {
    throw new Error('Error adding user: ' + error.message);
  }
}

async function getUserByEmail(email) {
  try {
    const userRef = db.collection('users');  // Koleksi 'users'
    const snapshot = await userRef.where('email', '==', email).get();  // Mengambil data berdasarkan email

    if (snapshot.empty) {
      return null;  // Jika tidak ada pengguna dengan email tersebut
    }
    
    const userDoc = snapshot.docs[0];
    // Mengembalikan pengguna pertama yang ditemukan (karena email harus unik)
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    throw new Error('Error fetching user by email: ' + error.message);
  }
}

module.exports = { addUser, getUserByEmail };
