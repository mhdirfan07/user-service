const db = require('../firebaseConfig'); // Mengimpor db yang sudah dikonfigurasi

async function getAll() {
  try {
    const userRef = db.collection("users"); // Mengakses koleksi 'users'
    const snapshot = await userRef.get(); // Mengambil semua dokumen dalam koleksi 'users'

    if (snapshot.empty) {
      return []; // Jika tidak ada pengguna
    }

    // Mengembalikan data pengguna dalam array
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return users;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
}

async function getUserById(userId) {
  try {
    const userRef = db.collection("users").doc(userId); // Mengakses pengguna berdasarkan ID
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return null; // Jika pengguna tidak ditemukan
    }

    return { id: userDoc.id, ...userDoc.data() }; // Mengembalikan data pengguna
  } catch (error) {
    throw new Error("Error retrieving user: " + error.message);
  }
}

async function update(userId, updatedData) {
  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return null; // Jika pengguna tidak ditemukan
    }

    await userRef.update(updatedData); // Memperbarui data pengguna
    return { id: userDoc.id, ...updatedData }; // Mengembalikan data yang diperbarui
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
}

async function remove(userId) {
  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return null; // Jika pengguna tidak ditemukan
    }

    await userRef.delete(); // Menghapus pengguna dari Firestore
    return true;
  } catch (error) {
    throw new Error("Error deleting user: " + error.message);
  }
}

module.exports = {
  getUserById,
  update,
  remove,
  getAll,
};
