const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./configs/database");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const gameRoutes = require("./routes/games");
const protect = require("./middlewares/auth");

require("dotenv").config();

async function mountApp() {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());

  await connectDB();

  app.get("/", (req, res) => res.send("Welcome to the game!"));
  app.use("/auth", authRoutes);
  app.use("/users", protect, userRoutes);
  app.use("/game", protect, gameRoutes);

  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

mountApp().catch((error) => console.log(error));
