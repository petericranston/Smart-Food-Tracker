const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv").config(); //Configuring my .env for secret keys (mongodb)
const mongoose = require("mongoose");

const app = express();
const { SearchProduct, GetProductByBarcode } = require("./services/api");
const database = require("./models/database");

app.use(cors());
app.use(express.json());

const mongoDBUsername = process.env.mongoDBUsername; //Getting data from env file
const mongoDBPassword = process.env.mongoDBPassword;
const mongoAppName = process.env.mongoAppName;

const connectionString = `mongodb+srv://${mongoDBUsername}:${mongoDBPassword}@cluster0.hxdji7a.mongodb.net/${mongoAppName}?retryWrites=true&w=majority`;
//Building connection string for mongodb
mongoose.connect(connectionString);

app.get("/", (request, response) => {
  response.send("Backend running");
});

app.post("/api/register", async (request, response) => {
  const { username, password } = request.body;
  const user = await database.newUser(username, password, []); // empty array for ingredients

  if (!user)
    return response.status(500).json({ error: "Failed to create user" });

  response.json({ success: true });
});

app.post("/api/login", async (request, response) => {
  //Login functionality
  const user = await database.checkUser(
    request.body.username,
    request.body.password,
  );

  if (user) {
    response.json({ success: true, username: user.Username });
  } else {
    console.log("Login Failed");
  }
});

app.post("/api/searchProduct", async (request, response) => {
  const search = request.body.searchQuery;
  const results = await SearchProduct(search);
  response.json(results);
});

app.post('/api/getProductByBarcode', async (req, res) => {
  const { barcode } = req.body;
  const product = await GetProductByBarcode(barcode);
  if (!product) return res.json(null);
  res.json(product);
});

app.post("/api/saveIngredients", async (request, response) => {
  try {
    const { username, ingredients } = request.body;

    const user = await database.getUserByUsername(username);
    if (!user) return response.status(404).json({ error: "User not found" });

    await database.addIngredients(user._id, ingredients);

    response.json({ success: true });
  } catch (err) {
    console.log(err);
    response.status(500).json({ error: "Server error" });
  }
});

app.post("/api/getIngredients", async (request, response) => {
  try {
    const { username } = request.body;

    const user = await database.getUserByUsername(username);
    if (!user) return response.status(404).json({ error: "User not found" });

    const ingredients = await database.getIngredients(user._id);

    response.json(ingredients);
  } catch (err) {
    console.log(err);
    response.status(500).json({ error: "Server error" });
  }
});

app.listen(3001, "0.0.0.0", () => {
  console.log("Server running on port 3001");
});
