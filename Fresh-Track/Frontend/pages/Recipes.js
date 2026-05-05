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
import { useState } from "react";

export default function Recipes() {
  const insets = useSafeAreaInsets();
  const [savedVisible, setSavedVisible] = useState(false);
  const [savedNames, setSavedNames] = useState(new Set());
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const dummyDishes = [
    {
      dishEmoji: "🍝",
      name: "Spaghetti Bolognese",
      time: "45 mins",
      serves: 4,
      ingredients: 6,
      ingredientsList: [
        "Spaghetti",
        "Beef mince",
        "Tomato passata",
        "Onion",
        "Garlic",
        "Olive oil",
      ],
      steps: [
        "Boil spaghetti in salted water until al dente",
        "Fry onion and garlic in olive oil until soft",
        "Add beef mince and cook until browned",
        "Pour in passata and simmer for 20 minutes",
        "Season with salt and pepper",
        "Serve mince over spaghetti",
      ],
    },
    {
      dishEmoji: "🍗",
      name: "Lemon Herb Chicken",
      time: "30 mins",
      serves: 2,
      ingredients: 5,
      ingredientsList: [
        "Chicken breast",
        "Lemon",
        "Garlic",
        "Olive oil",
        "Mixed herbs",
      ],
      steps: [
        "Mix lemon juice, garlic, olive oil and herbs",
        "Marinate chicken for at least 15 minutes",
        "Heat a pan over medium-high heat",
        "Cook chicken for 6-7 minutes each side",
        "Rest for 5 minutes before serving",
      ],
    },
    {
      dishEmoji: "🥗",
      name: "Caesar Salad",
      time: "15 mins",
      serves: 3,
      ingredients: 5,
      ingredientsList: [
        "Romaine lettuce",
        "Parmesan",
        "Croutons",
        "Caesar dressing",
        "Black pepper",
      ],
      steps: [
        "Wash and chop romaine lettuce",
        "Add croutons and parmesan shavings",
        "Drizzle caesar dressing over the salad",
        "Toss everything together",
        "Season with black pepper and serve",
      ],
    },
  ];

  const toggleSaved = (name) => {
    setSavedNames((prev) => {
      const updated = new Set(prev);
      updated.has(name) ? updated.delete(name) : updated.add(name);
      return updated;
    });
  };

  const savedDishes = dummyDishes.filter((item) => savedNames.has(item.name));

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
            {dummyDishes.map((item) => (
              <RecipesWidget
                key={item.name}
                dishEmoji={item.dishEmoji}
                dishName={item.name}
                dishTime={item.time}
                pplServed={item.serves}
                numIngredients={item.ingredients}
                isSaved={savedNames.has(item.name)}
                onToggleSave={() => toggleSaved(item.name)}
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
              {savedDishes.length > 0 ? (
                savedDishes.map((item) => (
                  <RecipesWidget
                    key={item.name}
                    dishEmoji={item.dishEmoji}
                    dishName={item.name}
                    dishTime={item.time}
                    pplServed={item.serves}
                    numIngredients={item.ingredients}
                    isSaved={true}
                    onToggleSave={() => toggleSaved(item.name)}
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
