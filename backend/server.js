const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "Hello from Backend",
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});