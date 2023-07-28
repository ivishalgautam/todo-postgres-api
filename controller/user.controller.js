const { pool } = require("../config/db");

const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const { rows, rowCount } = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );
    if (rowCount <= 0)
      return res.status(404).json({ error: "User not found!" });

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [
      userId,
    ]);

    if (rowCount <= 0)
      return res.status(404).json({ error: "User not found!" });

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { ...userData } = req.body;

  const updateColumns = Object.keys(userData)
    .map((column, key) => `${column} = $${key + 1}`)
    .join(", ");
  const updateValues = Object.values(userData);

  try {
    const { rowCount, rows } = await pool.query(
      `UPDATE users SET ${updateColumns} WHERE id = $${
        updateValues.length + 1
      } RETURNING *;`,
      [...updateValues, userId]
    );

    if (rowCount === 0)
      return res.status(404).json({ error: "User not found!" });

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (existingUser.rowCount > 0)
      return res.status(400).json({ error: "User already exist!" });

    const user = await pool.query(
      "INSERT INTO users (username,password) VALUES ($1,$2) returning *",
      [username, password]
    );
    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUsers, getUserById, deleteUser, updateUser, createUser };
