import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";



export default function UseRecipeButton({ recipe, username }) {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const handlePress = async () => {
    console.log("recipe:", recipe);
    console.log("recipe.ingredients:", recipe.ingredientsUsed);
    console.log("is array:", Array.isArray(recipe.ingredientsUsed));
    console.log("length:", recipe.ingredientsUsed?.length);

    for (const ingredient of recipe.ingredientsUsed) { //for each ingredient in recipe
      console.log('test test')
      await fetch(`${API_URL}/api/useIngredient`, { //runs useIngredient function through express route
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          ingredientId: ingredient.ingredientId
        })
      });
    }
    //get the recipe ID and the IDs for each of the ingredients in it
    //run query function to update the ingredients used field based on the ID from recipe.
  }



  return (
    <TouchableOpacity style={styles.btn} onPress={handlePress}>
      <Text style={styles.btnText}>Use Recipe</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: 30,
    padding: 20,
  },
  title: {
    fontSize: RFValue(24),
    fontFamily: "Inter_600SemiBold",
    marginBottom: 16,
  },
  btnDisabled: {
    backgroundColor: "#555",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    marginBottom: 20,
  },
  recipeCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  recipeTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  recipeText: {
    color: "#d4d4d4",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
  },
  btn: {
    backgroundColor: "#50863F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
});