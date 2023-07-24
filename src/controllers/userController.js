const { validationResult } = require("express-validator");
const pool = require("../config/dbConfig");

// Create a new user
const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, age } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO users (name, email, age) VALUES (?, ?, ?)",
      [name, email, age]
    );

    const createdUserId = result.insertId;
    res.status(200).json({ id: createdUserId, name, email, age });
  } catch (err) {
    res.status(500).json({ error: "Failed to create new user" });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM users");
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

// Update an existing user
const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, email, age } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?",
      [name, email, age, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ id, name, email, age });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id=?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

module.exports = { createUser, getUsers, updateUser, deleteUser };
