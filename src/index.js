require("dotenv").config();
const express = require("express");
const http = require("http");
const connection = require("./config/database");
const authRoutes = require("./routes/AuthRoutes");
const userRoutes = require("./routes/UserRoutes");
const handleError = require("./middleware/handleError");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

const auth = require("./middleware/auth");

const socketIO = require("socket.io");
const socket = require("./config/socket");

app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

const server = http.createServer(app);
const io = socketIO(server);
socket(io);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal Server Error",
  });
});

const friendRouter = require("./routes/FriendRoutes")(io);

(async () => {
  try {
    await connection();

    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/friends", auth, friendRouter);
    app.use(handleError);
    app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
