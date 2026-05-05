import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { RFValue } from "react-native-responsive-fontsize";
import RecipesWidget from "../components/RecipesWidget";
import RecipeDetail from "../components/RecipeDetail";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RecipeTestCompAIEdited from "../components/recipeTestCompAIEdited";

export default function Recipes() {
  const insets = useSafeAreaInsets();
  const [savedVisible, setSavedVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [username, setUsername] = useState("");

  const [savedRecipes, setSavedRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [generatedRecipes, setGeneratedRecipes] = useState([]);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const init = async () => {
      const savedUsername = await AsyncStorage.getItem("username");
      if (!savedUsername) return;
      setUsername(savedUsername);

      const response = await fetch(`${API_URL}/api/getIngredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: savedUsername }),
      });
      const data = await response.json();
      if (response.ok) setIngredients(data);
    };
    init();
  }, []);

  const toggleSaved = (item) => {
    setSavedRecipes((prev) => {
      const exists = prev.find((r) => r.name === item.name);
      if (exists) {
        return prev.filter((r) => r.name !== item.name);
      } else {
        return [...prev, item];
      }
    });
  };

  async function saveRecipe(savedRecipe) {
    try {
      const savedUsername = await AsyncStorage.getItem("username");
      if (!savedUsername) {
        console.log("No user logged in");
        return;
      }
      const response = await fetch(`${API_URL}/api/saveRecipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: savedUsername,
          savedRecipe: savedRecipe,
        }),
      });
      const data = await response.json();
      if (!response.ok) return;
    } catch (error) {
      console.log("Error saving recipe", error);
    }
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.h1}>Recipes</Text>
            <TouchableOpacity
              onPress={() => setSavedVisible(true)}
              style={{
                backgroundColor: "#50863F",
                padding: 10,
                width: "23%",
                borderRadius: 20,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "Inter_600SemiBold",
                  fontSize: RFValue(14),
                }}
              >
                Saved
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: "center" }}>
            <RecipeTestCompAIEdited
              ingredients={ingredients.map((i) => ({
                name: i.IngredientName,
                expiryDate: i.ExpiryDate,
              }))}
              onRecipeGeneration={(recipes) => setGeneratedRecipes(recipes)}
            />
            {generatedRecipes.map((item) => (
              <RecipesWidget
                key={item.name}
                dishEmoji={item.recipeEmoji}
                dishName={item.name}
                dishTime={item.estimatedTime}
                pplServed={item.peopleServed}
                numIngredients={item.numberOfIngredients}
                isSaved={savedRecipes.some((r) => r.name === item.name)}
                onToggleSave={() => {
                  toggleSaved(item);
                  if (!savedRecipes.some((r) => r.name === item.name))
                    saveRecipe(item);
                }}
                onPress={() => setSelectedRecipe(item)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      {/* Saved Recipes Modal */}
      <Modal
        visible={savedVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setSavedVisible(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top + 15 }]}>
          <TouchableOpacity
            onPress={() => setSavedVisible(false)}
            style={{ alignSelf: "flex-end" }}
          >
            <Text style={{ fontSize: 24 }}>✕</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.h1, { marginBottom: 5 }]}>Saved Recipes</Text>

            <View style={{ alignItems: "center" }}>
              {savedRecipes.length > 0 ? (
                savedRecipes.map((item) => (
                  <RecipesWidget
                    key={item.name}
                    dishEmoji={item.recipeEmoji}
                    dishName={item.name}
                    dishTime={item.estimatedTime}
                    pplServed={item.peopleServed}
                    numIngredients={item.numberOfIngredients}
                    isSaved={true}
                    onToggleSave={() => toggleSaved(item)}
                    onPress={() => {
                      setSavedVisible(false);
                      setTimeout(() => setSelectedRecipe(item), 300);
                    }}
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>No saved recipes yet.</Text>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5EC",
    paddingTop: 25,
    paddingLeft: 25,
    paddingRight: 25,
  },
  h1: {
    fontSize: RFValue(24),
    fontFamily: "Inter_600SemiBold",
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F8F5EC",
    paddingLeft: 25,
    paddingRight: 25,
  },
  emptyText: {
    marginTop: 40,
    fontSize: RFValue(14),
    color: "#707070",
    fontFamily: "Inter_500Medium",
  },
});
