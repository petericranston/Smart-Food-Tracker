import OpenAI from "openai";
import { useState } from "react";
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

export default function RecipeTestCompAIEdited({
  ingredients,
  onRecipeGeneration,
}) {
  const openai = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  function formatDateDDMMYYYY(date = new Date()) {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  function parseDDMMYYYY(dateStr) {
    const [dd, mm, yyyy] = dateStr.split("-");
    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  function sortByExpiry(items) {
    return [...items].sort((a, b) => {
      if (!a.expiryDate) return 1;
      if (!b.expiryDate) return -1;
      return new Date(a.expiryDate) - new Date(b.expiryDate);
    });
  }

  function safeParseJson(text) {
    try {
      return JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    }
  }

  const currentDate = formatDateDDMMYYYY();
  const recipeCount = 3;
  const sortedIngredients = sortByExpiry(ingredients);

  const PROMPT = `
You are a professional chef making recipe suggestions for users.

You will be given a list of ingredients, each with an expiry date.
The current date is ${currentDate}.
Leave the favourite part blank as it will be filled in later
Number of ingredients should be the number of ingredients used in the recipe (including missing ingredients)
People served should be how many people the recipe can feed - use the average caloric intake of an adult and the rough calorie value of the recipe to calculate this
The recipeEmoji should match the name of the recipe e.g chicken and rice should have a chicken emoji and a rice emoji if possible


Your goal:
- Generate ${recipeCount} recipes
- Prioritise ingredients with the shortest time left before expiry
- Use as many soon-expiring ingredients as possible
- Create simple recipes that do not rely on unusual ingredients
- Ensure the recipes are varied

Rules:
- Prioritise ingredients the user already has
- Prioritise ingredients that are expiring soon
- You may include ingredients the user does not have, but keep this to a minimum
- Missing ingredients should be common household ingredients
- Do not use rare or hard-to-find missing ingredients
- Do not reuse the same primary ingredients across recipes unless necessary
- You may reuse supporting ingredients such as butter, spices, oil, salt, and pepper
- Ensure each recipe is clearly different from the others
- Use common, well-known home-style meals
- Ensure instructions are clear and practical
- Give each recipe a priorityScore from 0 to 10 based on how well it uses soon-expiring ingredients
- 10 means it makes excellent use of soon-expiring ingredients
- 0 means it makes poor use of them
- Use of items that are passed their expiry date should be avoided, if ingredient is used, it must be under the missing items section, never an ingredient the user has 

Return ONLY valid JSON in this exact structure:

{
  "recipes": [
    {
      "name": "Creamy Chicken Pasta",
      "priorityScore": 8,
      "ingredientsUsed": [
        {
          "name": "chicken breast",
          "amount": "2 fillets",
          "expiryDate": "2026-04-23"
        }
      ],
      "missingIngredients": [
        {
          "name": "garlic",
          "amount": "2 cloves"
        }
      ],
      "steps": [
        "Cook the chicken in a frying pan until browned.",
        "Boil the pasta until tender.",
        "Add the cream and cheese to make a sauce.",
        "Combine and serve."
      ],
      "estimatedTime": "25 minutes",
      "favourite" : false,
      "numberOfIngredients" : 5,
      "peopleServed" : 2,
      "recipeEmoji" : "emoji",
    }
  ]
}

Ingredients:
${JSON.stringify(sortedIngredients, null, 2)}
`;

  const getRecipe = async () => {
    try {
      const result = await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0,
        max_tokens: 2500,
        messages: [
          {
            role: "user",
            content: PROMPT,
          },
        ],
      });

      const content = result.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No content returned from OpenAI");
      }

      const parsedRecipes = safeParseJson(content);
      console.log("using ingredients from list", parsedRecipes);

      return parsedRecipes;
    } catch (err) {
      Alert.alert("Error", "Could not generate recipe");
      console.error(err);
      return null;
    }
  };

  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);

  const handleTest = async () => {
    setLoading(true);
    console.log("BUTTON PRESSED - handleTest started");
    const data = await getRecipe();

    console.log("Data returned from getRecipe:", data);
    console.log("onRecipeGeneration prop:", onRecipeGeneration);

    if (data?.recipes) {
      setRecipes(data.recipes);
      onRecipeGeneration?.(data.recipes);
    }

    setLoading(false);
  };
  return (
    <View>
      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={handleTest}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Generate Recipes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
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
  btn: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
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
});
