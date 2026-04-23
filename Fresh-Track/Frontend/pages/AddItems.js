import {
  Text,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFValue } from "react-native-responsive-fontsize";
import ItemInput from "../components/ItemInput";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { useState, useEffect } from "react";
import ReceiptScanner from "../components/ReceiptScanner";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function AddItems() {
  const [username, setUsername] = useState("");
  useEffect(() => {
    const loadUser = async () => {
      const savedUsername = await AsyncStorage.getItem("username");
      if (savedUsername) setUsername(savedUsername);
    };
    loadUser();
  }, []);

  const today = new Date();
  const currentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResponse, setSearchResponse] = useState(null);
  const [scannedItems, setScannedItems] = useState([]);

  // Modal visibles
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [barcodeVisible, setBarcodeVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const formatExpiry = (expiryDate) => {
    if (!expiryDate) return "-/-";
    const date = new Date(expiryDate);
    const now = new Date();

    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    if (date > oneYearFromNow) {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  async function searchProduct() {
    try {
      const response = await fetch(`${API_URL}/api/searchProduct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchQuery }),
      });
      if (!response.ok) return;
      const returnedProducts = await response.json();
      const filtered = returnedProducts.filter(
        (item) =>
          item.name &&
          item.name.length > 2 &&
          item.image &&
          !item.name.toLowerCase().includes("unknown"),
      );
      setSearchResponse(filtered);
    } catch (error) {
      console.log("Failed to search for product", error);
    }
    setSearchQuery("");
  }

  async function addIngredientToPantry(ingredientName) {
    const PROMPT = `You are a deterministic food classification engine.

    Task:
    You will be given a single ingredient name. Return ONLY one valid JSON object matching the exact schema below.
    The ingredient name is: ${ingredientName}

    Hard requirements:
    - Output JSON only
    - No markdown
    - No explanations
    - No extra text
    - No extra keys
    - If a value is missing, use null

    Current date:
    - currentDate = ${currentDate}
    - All date estimates must be calculated from currentDate

    Classification rules:
    For the ingredient, determine:
    1. "food_group"
    2. "storage_state"
    3. "predicted_expiry_date"
    4. "expiration_date_rating"

    Allowed values for "food_group":
    - "meat"
    - "dairy"
    - "fruit"
    - "vegetable"
    - "beverage"
    - "bakery"
    - "frozen"
    - "pantry"
    - "snack"
    - "prepared food"
    - "seafood"

    Allowed values for "storage_state":
    - "frozen"
    - "chilled"
    - "ambient"
    - null

    Critical storage-state rules:
    - If the ingredient name clearly suggests frozen storage, set "storage_state" to "frozen"
    - Frozen wording or strong frozen clues override fresh produce logic
    - Examples of strong frozen clues include: frozen, fries, chips, wedges, hash browns, ice cream, frozen pizza, frozen vegetables, frozen ready meals
    - If "storage_state" is "frozen", do NOT estimate expiry using fresh vegetable, bakery, or chilled rules
    - Frozen foods should usually have expiration estimates in weeks to months, not days

    Critical unopened storage assumption:
    - Assume every product is unopened
    - Assume every product is stored correctly in its proper place
    - For chilled items, assume correct refrigeration
    - For frozen items, assume correct freezer storage
    - For ambient items, assume normal cupboard or pantry storage
    - Estimate shelf life based on unopened products stored correctly, not opened products
    - Do NOT shorten expiry because of opened-package assumptions
    - Prefer typical manufacturer unopened shelf life over opened-at-home usage life
    - For products like cream, yoghurt, cheese, butter, sauces, and packaged dairy, assume unopened refrigerated shelf life

    Expiry rules:
    - "predicted_expiry_date" must be exactly one date in YYYY-MM-DD format or null
    - Estimate from currentDate
    - If no reliable estimate is possible, use null
    - Always be conservative
    - Always subtract 1 day from the chosen shelf-life estimate
    - Conservative does NOT mean unrealistically short; use realistic unopened shelf life for correctly stored products

    Shelf-life estimation rules:
    - Fresh meat or seafood: 1-3 days
    - Packaged meat: 5-7 days
    - Milk and fresh dairy: 5-7 days
    - Double cream, whipping cream, single cream, and similar unopened chilled cream products: often substantially longer than fresh milk; use a realistic unopened chilled estimate, often weeks rather than days
    - Yoghurts and many unopened chilled dairy products often last longer than milk; do not force them into very short milk-style estimates
    - Hard cheese: often weeks if unopened and refrigerated
    - Processed cheese and cheese spread: moderate to long shelf life if unopened
    - Butter and margarine: usually weeks if unopened and stored correctly
    - Bread and fresh bakery: 3-5 days
    - Fresh fruit and vegetables: 3-10 days
    - Frozen foods of any kind: weeks to months, not days
    - Pantry foods, snacks, chocolate, tinned goods, water, and shelf-stable beverages: weeks to months
    - If unclear, prefer a safer but still category-correct estimate
    - Avoid unrealistically early expiry dates for unopened packaged products

    Expiration rating rules:
    - "green" = long shelf life or highly reliable estimate
    - "yellow" = moderate shelf life
    - "red" = short shelf life, high risk, or uncertain classification

    Final checks:
    - Make sure frozen products are not given a short fresh-food expiry
    - Make sure unopened packaged dairy and chilled products are not given unrealistically short expiry dates

    Return exactly this JSON schema shape and nothing else:
    {
      "food_group": null,
      "storage_state": null,
      "predicted_expiry_date": null,
      "expiration_date_rating": null
    }
    `;

    try {
      const result = await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0,
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: PROMPT,
          },
        ],
      });

      const parsedResults = JSON.parse(result.choices[0].message.content);
      console.log(parsedResults);
      setScannedItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: ingredientName,
          expiryDate: parsedResults.predicted_expiry_date,
          foodQuantity: 1,
          unit: null,
          foodGroup: parsedResults.food_group,
          storageState: parsedResults.storage_state,
        },
      ]);
    } catch (error) {
      console.log("OpenAI error:", JSON.stringify(error)); // more detail than just error
    }

    setSearchVisible(false);
  }

  async function saveIngredients(SearchedIngredients) {
    try {
      const savedUsername = await AsyncStorage.getItem("username");
      if (!savedUsername) {
        console.log("No user logged in");
        return;
      }
      const response = await fetch(`${API_URL}/api/saveIngredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: savedUsername,
          ingredients: SearchedIngredients,
        }),
      });
      const data = await response.json();
      if (!response.ok) return;
      console.log("Ingredient saved!", data);
      setScannedItems([]);
    } catch (error) {
      console.log("Error saving ingredient", error);
    }
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.h1}>Add items</Text>
        <Text style={styles.h2}>Choose how to add your food</Text>

        <View style={{ alignItems: "center", marginTop: 15 }}>
          <View style={{ flexDirection: "row", gap: 20, marginBottom: 23 }}>
            <ItemInput
              inputChoice={"Scan receipt"}
              onPressFunction={() => setReceiptVisible(true)}
            >
              <Ionicons name="receipt-outline" color="white" size={40} />
            </ItemInput>
            <ItemInput
              inputChoice={"Scan barcode"}
              onPressFunction={() => setBarcodeVisible(true)}
            >
              <Ionicons name="barcode-outline" size={40} color="white" />
            </ItemInput>
          </View>

          <ItemInput
            inputChoice={"Search item"}
            onPressFunction={() => setSearchVisible(true)}
          >
            <Feather name="search" size={40} color="white" />
          </ItemInput>
        </View>

        {/* Divider line */}
        <View
          style={{
            height: 1,
            backgroundColor: "#B5B5B549",
            marginTop: 25,
            shadowColor: "#000000",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            elevation: 4,
          }}
        />

        <View
          style={{
            marginTop: 25,
            padding: 15,
            borderColor: "#B5B5B550",
            borderWidth: 2,
            maxHeight: 300,
            minHeight: 50,
          }}
        >
          <FlatList
            data={scannedItems}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", fontSize: RFValue(14) }}>
                Added items will show here!
              </Text>
            }
            renderItem={({ item }) => {
              const displayUnit = item.unit
                ? `${item.foodQuantity} x ${item.unit}`
                : `${item.foodQuantity} x`;
              return (
                <View style={styles.itemsRow}>
                  <Text
                    numberOfLines={3}
                    style={{ fontSize: RFValue(14), width: "70%" }}
                  >
                    {displayUnit} {item.name}
                  </Text>
                  <Text style={{ color: "#888", fontSize: RFValue(14) }}>
                    {formatExpiry(item.expiryDate)}
                  </Text>
                </View>
              );
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.saveItems}
          onPress={() => saveIngredients(scannedItems)}
        >
          <Ionicons name="checkmark-circle-outline" color="white" size={20} />
          <Text style={styles.saveItemsText}>Save Items</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* ---------Modals--------- */}

      {/* Receipt modal */}
      <Modal
        visible={receiptVisible}
        transparent={false}
        statusBarTranslucent={true}
        animationType="slide"
        onRequestClose={() => setReceiptVisible(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top + 15 }]}>
          {" "}
          {/* insets stop the modal going to the top when first running 
        the app for some reason safearea view doesn't work properly */}
          <TouchableOpacity
            onPress={() => setReceiptVisible(false)}
            style={{ alignSelf: "flex-end" }}
          >
            <Text style={{ fontSize: 24 }}>✕</Text>
          </TouchableOpacity>
          <ReceiptScanner
            onScanComplete={(data) => {
              const mapped = data.products.map((product, index) => ({
                id: index + 1,
                name: product.product_name,
                expiryDate: product.product_expiration_date
                  ? product.product_expiration_date
                      .split("-")
                      .reverse()
                      .join("-")
                  : null,
                foodGroup: product.food_group,
                storageState: product.storage_state,
                foodQuantity: product.number_of_products,
                unit: null,
              }));
              setScannedItems(mapped);
              setReceiptVisible(false);
            }}
          />
        </View>
      </Modal>

      {/* Barcode modal */}
      <Modal
        visible={barcodeVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setBarcodeVisible(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top + 15 }]}>
          <TouchableOpacity
            onPress={() => setBarcodeVisible(false)}
            style={{ alignSelf: "flex-end" }}
          >
            <Text style={{ fontSize: 24 }}>✕</Text>
          </TouchableOpacity>
          <Text>Barcode</Text>
        </View>
      </Modal>

      {/* Search modal */}
      <Modal
        visible={searchVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setSearchVisible(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top + 15 }]}>
          <TouchableOpacity
            onPress={() => setSearchVisible(false)}
            style={{ alignSelf: "flex-end" }}
          >
            <Text style={{ fontSize: 24 }}>✕</Text>
          </TouchableOpacity>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for an ingredient..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchBtn} onPress={searchProduct}>
              <Text style={styles.searchBtnText}>Search</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.results}
            contentContainerStyle={{ paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
          >
            {searchResponse &&
              searchResponse.map((item, index) => (
                <View key={index} style={styles.resultCard}>
                  <View style={styles.resultRow}>
                    {item.image && (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.productImage}
                      />
                    )}
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{item.name}</Text>
                      {item.brand && (
                        <Text style={styles.productBrand}>{item.brand}</Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={() => addIngredientToPantry(item.name)}
                  >
                    <Text style={styles.saveBtnText}>+ Add to Pantry</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5EC",
    paddingTop: 20,
    paddingLeft: 25,
    paddingRight: 25,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F8F5EC",
    paddingLeft: 30,
    paddingRight: 30,
  },
  h2: {
    fontSize: RFValue(14),
    color: "#707070",
    fontFamily: "Inter_500Medium",
    marginBottom: 20,
    textAlign: "center",
  },
  h1: {
    fontSize: RFValue(24),
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
    marginBottom: 5,
  },
  itemsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  searchRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#1a1d27",
    borderWidth: 1,
    borderColor: "#2a2d3a",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#ffffff",
    fontSize: 15,
    marginRight: 10,
  },
  searchBtn: {
    backgroundColor: "#4ade80",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBtnText: {
    color: "#0f1117",
    fontWeight: "700",
    fontSize: 14,
  },
  results: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultCard: {
    backgroundColor: "#1a1d27",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2d3a",
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#0f1117",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 13,
    color: "#6b7280",
  },
  saveBtn: {
    backgroundColor: "#16a34a",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  saveItems: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#16a34a",
    marginTop: 16,
    marginHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  saveItemsText: {
    color: "#ffffff",
    fontSize: RFValue(15),
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
  },
});
