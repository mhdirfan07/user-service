const {
  getUserById,
  update,
  remove,
  getAll,
} = require("../models/user");

async function getAllUsers(req, res) {
  try {
    const users = await getAll(); // Mengambil semua pengguna dari model
    if (users.length === 0) {
      return res.status(404).send({ message: "No users found." });
    }
    res.status(200).send(users); // Mengembalikan daftar pengguna
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).send({ message: "Server error, please try again later." });
  }
}

async function getUser(req, res) {
  const userId = req.params.id; // Mengambil ID dari parameter URL

  try {
    const user = await getUserById(userId); // Mengambil data pengguna dari model
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    res.status(200).send(user); // Mengembalikan data pengguna
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send({ message: "Server error, please try again later." });
  }
}

async function updateUser(req, res) {
  const userId = req.params.id;
  const { name, email, address, phone_number } = req.body;

  // Create an object with only the fields that are provided in the request
  const updatedData = {};

  if (name) updatedData.name = name;
  if (email) updatedData.email = email;
  if (address) updatedData.address = address;
  if (phone_number) updatedData.phone_number = phone_number;

  // If no fields are provided to update, return an error message
  if (Object.keys(updatedData).length === 0) {
    return res
      .status(400)
      .send({ message: "At least one field is required to update." });
  }

  // Add the updatedAt field to track when the update occurred
  updatedData.updatedAt = new Date();

  try {
    // Assuming you have a function `update` that updates the user in the database
    const user = await update(userId, updatedData);

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    res.status(200).send({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ message: "Server error, please try again later." });
  }
}

async function deleteUser(req, res) {
  const userId = req.params.id;

  try {
    const result = await remove(userId); // Menghapus data pengguna dari model
    if (!result) {
      return res.status(404).send({ message: "User not found." });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ message: "Server error, please try again later." });
  }
}

module.exports = { getAllUsers, getUser, updateUser, deleteUser };
