const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect("mongodb+srv://ehsan:1234@todo.it9yp1x.mongodb.net/?appName=todo")
  .then(() => console.log("MongoDB Atlas Connected ✅"))
  .catch((err) => console.error("Mongo Error ❌", err));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/todos", require("./routes/todos"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
