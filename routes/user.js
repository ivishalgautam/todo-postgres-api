const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUserById,
  deleteUser,
  updateUser,
} = require("../controller/user.controller");

// POST
router.post("/", createUser);

// DELETE
router.delete("/:userId", deleteUser);

// UPDATE
router.put("/:userId", updateUser);

// GET
router.get("/", getUsers);
router.get("/:userId", getUserById);

module.exports = router;
