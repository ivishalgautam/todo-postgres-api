const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/user");
const todoRoutes = require("./routes/todo");
const authRoutes = require("./routes/auth");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

app.listen(4000, () => {
  console.log(`server up at localhost:4000`);
});
