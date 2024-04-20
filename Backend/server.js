require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connect = require("./db/connection");

app.use(cors());
app.use(express.json());

app.use("/admin", require("./routes/adminTasksRoutes"));
app.use("/tasks", require("./routes/userTaskRoutes"));
app.use("/users", require("./routes/usersRoutes"));

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connect();
    app.listen(PORT, () => {
      console.log("Connected successfully to the database!");
      console.log(`Server is listening on port ${PORT}!`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

start();
