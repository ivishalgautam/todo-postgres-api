const { pool } = require("../config/db");

async function getTodos(req, res) {
  const { userId } = req.params;
  try {
    const { rows } = await pool.query(`SELECT * FROM todos;`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getUserTodos(req, res) {
  const { userId } = req.params;
  try {
    const userExist = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);
    if (userExist.rowCount === 0)
      return res.status(404).json({ error: "User not exist!" });
    const { rows } = await pool.query(
      `SELECT todo_id, title, description,is_completed FROM todos WHERE user_id = $1;`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getTodoById(req, res) {
  const { todoId } = req.params;
  try {
    const { rows, rowCount } = await pool.query(
      `SELECT * FROM todos WHERE todo_id = $1`,
      [todoId]
    );
    if (rowCount === 0)
      return res.status(404).json({ error: "Todo not found!" });

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteTodoById(req, res) {
  const { todoId } = req.params;
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM todos WHERE todo_id = $1`,
      [todoId]
    );

    if (rowCount === 0)
      return res.status(404).json({ error: "Todo not found!" });

    res.json({ message: "Todo  deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateTodoById(req, res) {
  const { todoId } = req.params;
  const { ...todoData } = req.body;

  const updateColumns = Object.keys(todoData)
    .map((column, key) => `${column} = $${key + 1}`)
    .join(", ");
  const updateValues = Object.values(todoData);
  //   console.log(updateColumns);
  //   console.log(updateValues);
  //   console.log(todoId);
  console.log(
    `UPDATE todos SET ${updateColumns} WHERE todo_id = ${
      updateValues.length + 1
    } RETURNING *;`
  );
  try {
    const { rowCount, rows } = await pool.query(
      `UPDATE todos SET ${updateColumns} WHERE todo_id = $${
        updateValues.length + 1
      } RETURNING *;`,
      [...updateValues, todoId]
    );
    if (rowCount === 0)
      return res.status(404).json({ error: "Todo not found!" });

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createTodo(req, res) {
  //   const { userId } = req.params;
  const { title, description, user_id } = req.body;
  try {
    const { rowCount, rows } = await pool.query(
      `INSERT INTO todos (title,description,user_id) VALUES ($1, $2, $3) RETURNING *`,
      [title, description, user_id]
    );
    if (rowCount === 0)
      return res.status(400).json({ error: "Something went wrong!" });

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createTodo,
  getTodos,
  getUserTodos,
  getTodoById,
  deleteTodoById,
  updateTodoById,
};
