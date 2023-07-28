const {
  createTodo,
  getUserTodos,
  getTodoById,
  deleteTodoById,
  updateTodoById,
} = require("../controller/todo.controller");

const router = require("express").Router();

// GET
router.get("/userTodos/:userId", getUserTodos);
router.get("/:todoId", getTodoById);

// POST
router.post("/", createTodo);

// PUT
router.put("/:todoId", updateTodoById);

// DELETE
router.delete("/:todoId", deleteTodoById);

module.exports = router;
