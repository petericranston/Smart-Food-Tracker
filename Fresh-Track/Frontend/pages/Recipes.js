import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Modal } from "react-native";
import { SafeAreaView, useSafeAreaInsets  } from "react-native-safe-area-context";
import { RFValue } from "react-native-responsive-fontsize";
import RecipesWidget from "../components/RecipesWidget";
import { useState } from "react";

export default function Recipes(){
    const insets = useSafeAreaInsets();
    const [savedVisible, setSavedVisible] = useState(false);
    const [savedNames, setSavedNames] = useState(new Set());

    const dummyDishes = [
        { dishEmoji: "🍝", name: "Spaghetti Bolognese", time: "45 mins", serves: 4, ingredients: 2 },
        { dishEmoji: "🍗", name: "Lemon Herb Chicken", time: "30 mins", serves: 2, ingredients: 4 },
        { dishEmoji: "🥗", name: "Caesar Salad", time: "15 mins", serves: 3, ingredients: 5 },
    ];

    const toggleSaved = (name) => {
        setSavedNames(prev => {
            const updated = new Set(prev);
            updated.has(name) ? updated.delete(name) : updated.add(name);
            return updated;
        });
    };

    const savedDishes = dummyDishes.filter(item => savedNames.has(item.name));

    return(
        <>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={styles.h1}>Recipes</Text>
                        <TouchableOpacity
                            onPress={() => setSavedVisible(true)}
                            style={{ backgroundColor: "#50863F", padding: 10, width: "23%", 
                                borderRadius: 20, marginBottom: 20 
                            }}
                        >
                            <Text style={{ color: "white", textAlign: "center", fontWeight: "Inter_600SemiBold", fontSize: RFValue(14) }}>Saved</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ alignItems: "center"}}>
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
                                    />
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No saved recipes yet.</Text>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </>
    )
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
    marginTop: 5
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
})