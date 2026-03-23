const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.send("Backend running");
});

app.get("/api/data", async (request, response) => {
  response.json({ message: "hello" });
});

app.listen(3001, "0.0.0.0", () => {
  console.log("Server running on port 3001");
});
