const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ingredientSchema = new Schema({
  //Making database document layout
  IngredientName: String,
  ExpiryDate: Date,
});

const userSchema = new Schema({
  Username: { type: String, unique: true },
  Password: String,
  Ingredients: [ingredientSchema],
});

const userData = model("users", userSchema);

async function newUser(username, password, ingredients) {
  //New user function
  try {
    const user = await userData.create({
      //Creating new user on mongodb
      Username: username,
      Password: password,
      Ingredients: ingredients,
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
    const ingredient = await userData.updateOne(
      //Pushing new ingredients on mongodb
      { _id: id },
      { $push: { Ingredients: { $each: ingredients } } },
    );
    return ingredient;
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
    Password: password,
  });
  return user;
}

module.exports = {
  newUser,
  addIngredients,
  getUserByUsername,
  getIngredients,
  checkUser,
};
