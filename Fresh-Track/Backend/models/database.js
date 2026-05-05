const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema, model } = mongoose;

const recipeIngredientsSchema = new Schema({
  ingredient: String,
});

const recipeStepsSchema = new Schema({
  step: String,
});

const recipeSchema = new Schema({
  dishEmoji: String,
  name: String,
  time: String,
  serves: Number,
  ingredientsNum: Number,
  ingredientsList: [recipeIngredientsSchema],
  steps: [recipeStepsSchema],
});

const ingredientSchema = new Schema({
  IngredientName: { type: String, required: true },
  ExpiryDate: { type: Date, default: null },
  FoodQuantity: { type: Number, default: 1 },
  Unit: { type: String, default: null },
  FoodGroup: { type: String, default: null },
  StorageState: { type: String, default: null },
});

const userSchema = new Schema({
  Username: { type: String, unique: true },
  Password: String,
  Ingredients: [ingredientSchema],
  savedRecipes: [recipeSchema],
});

const userData = model("users", userSchema);

async function newUser(username, password, ingredients, savedRecipes) {
  //New user function
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Encrypting
    const user = await userData.create({
      //Creating new user on mongodb
      Username: username,
      Password: hashedPassword,
      Ingredients: ingredients,
      savedRecipes: savedRecipes,
    });
    return user;
  } catch (err) {
    console.log("Error:", err);
    return false;
  }
}

async function addIngredients(id, ingredients) {
  //Adding Ingredients function
  try {
    const mapped = ingredients.map((item) => ({
      IngredientName: item.name,
      ExpiryDate: item.expiryDate || null,
      FoodQuantity: item.foodQuantity || 1,
      Unit: item.unit || null,
      FoodGroup: item.foodGroup || null,
      StorageState: item.storageState || null,
    }));
    const result = await userData.updateOne(
      { _id: id },
      { $push: { Ingredients: { $each: mapped } } },
    );
    return result;
  } catch (err) {
    console.log("Error:", err);
    return false;
  }
}

async function saveRecipe(id, savedRecipe) {
  //Adding recipe function
  try {
    const result = await userData.updateOne(
      { _id: id },
      { $push: { savedRecipes: savedRecipe } },
    );
    return result;
  } catch (err) {
    console.log("Error:", err);
    return false;
  }
}

async function getIngredients(id) {
  try {
    const user = await userData.findById(id, "Ingredients");
    return user.Ingredients;
  } catch (err) {
    console.log("Error:", err);
    return false;
  }
}

async function getUserByUsername(username) {
  try {
    const user = await userData.findOne({ Username: username });
    return user;
  } catch (err) {
    console.log("Error:", err);
    return false;
  }
}

async function checkUser(username, password) {
  //Checking if user exists
  //Finding user
  const user = await userData.findOne({
    Username: username,
  });
  if (!user) return null;

  const match = await bcrypt.compare(password, user.Password); //Decrypting
  if (!match) return null;

  return user;
}

module.exports = {
  newUser,
  addIngredients,
  getUserByUsername,
  getIngredients,
  checkUser,
  saveRecipe,
};
