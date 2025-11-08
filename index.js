const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/service");
const adminRoutes = require("./routes/adminRoutes");

const server = express();

server.use(cors({ origin: "http://127.0.0.1:5500" }));
server.use(express.json());
server.use(bodyParser.json());

// Serve static files (your HTML, CSS, JS files)
server.use(express.static(path.join(__dirname, "public")));

server.get("/", (req, res) => {
  res.send(
    " <div style='background-color: #f0f8ff;border: 2px solid #b0c4de;border-radius: 10px;padding: 20px;text-align: center;font-family: Arial, sans-serif; font-size: 18px;color: #4682b4;   box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);  margin: 20px;'>This is a server side render </div>"
  );
});

server.use(express.static("views"));

// User routes
server.use("/", userRoutes);
server.use("/service", serviceRoutes);
server.use("/admin", adminRoutes);

// Start the server
const port = process.env.PORT || 3000;


server.listen(port, () => {
  console.log("server is running on port ->" + port);
});
