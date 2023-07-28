const { pool } = require("../config/db");

async function login(req, res) {
  const { username, password } = req.body;
  try {
    const { rowCount, rows } = await pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );
    if (rowCount === 0)
      return res.status(404).json({ error: "User not exist!" });

    if (password !== rows[0].password)
      return res.status(400).json({ error: "Wrong credentials" });

    const todos = await pool.query(`SELECT * FROM todos WHERE user_id = $1`, [
      rows[0].id,
    ]);

    res.json({ user: rows[0], todos: todos.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function signUp(req, res) {
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
}

module.exports = { login, signUp };
