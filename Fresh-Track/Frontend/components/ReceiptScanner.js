// Aidan's code that he sent me that I am editing to work within our project and my front end
import * as ImagePicker from 'expo-image-picker';
import OpenAI from 'openai';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet
} from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";

const openai = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

export default function ReceiptScanner() {
    const [image, setImage] = useState(null);
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(false);

    function formatDateDDMMYYYY(date = new Date()) {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    }

    function getMimeType(uri = '') {
        const lower = uri.toLowerCase();
        if (lower.endsWith('.png')) return 'image/png';
        if (lower.endsWith('.webp')) return 'image/webp';
        return 'image/jpeg';
    }

    function safeParseJson(text) {
        try {
            return JSON.parse(text);
        } catch {
            const cleaned = text.replace(/```json|```/g, '').trim();
            return JSON.parse(cleaned);
        }
    }

    const currentDate = formatDateDDMMYYYY();

    const PROMPT = `You are a deterministic receipt extraction engine.

  Task:
  Read one receipt image and return ONLY one valid JSON object matching the exact schema below.

  Hard requirements:
  - Output JSON only
  - No markdown
  - No explanations
  - No extra text
  - No extra keys
  - If a value is missing, use null
  - If uncertain whether an item is edible, exclude it unless it is likely food; if included under uncertainty, set "expiration_date_rating" to "red"

  Current date rules:
  - currentDate = ${currentDate}
  - "dateOfScan" must always equal "${currentDate}"
  - If the receipt purchase date is visible, use it as "dateOfPurchase"
  - If the receipt purchase date is not visible, use "${currentDate}" as fallback for "dateOfPurchase"
  - Never invent any other date

  Receipt reading rules:
  - Read top to bottom in strict order
  - Treat each visible line as separate initially
  - Merge adjacent lines only when clearly part of the same product
  - If a line has no price and the next line does, merge if they describe one product
  - If a line is only a descriptor such as size, flavour, or pack size, attach it to the nearest matching product line
  - Correct obvious OCR errors only when meaning is clear
  - Ignore totals, discounts, loyalty lines, payment lines, coupons, bags, and non-food items

  Product rules:
  - Extract edible grocery items only
  - Keep product wording close to the receipt, but expand obvious abbreviations when meaning is clear
  - Do NOT deduplicate products
  - If the same product appears multiple times on separate lines, return separate entries
  - If the receipt indicates multiple units of the same product, return one separate product object per unit
  - The number of product objects in the JSON must reflect the true quantity purchased, not just the number of distinct product names

  Critical duplicate and quantity rules:
  - Never collapse repeated identical products into one entry
  - If the same item appears 3 times on the receipt, output 3 separate product objects
  - If quantity markers indicate multiple units, output that many separate product objects
  - This includes markers such as: x2, x3, *2, *3, 2x, 3x, 2 @, 3 @, Qty 2, Qty 3, or clear multibuy quantity indicators tied to one product
  - If a product line shows a quantity greater than 1, repeat the product entry once per unit
  - If the same product appears once with quantity 3, output 3 separate identical product objects, not 1
  - If the same product appears on three separate lines, also output 3 separate product objects
  - Prefer preserving duplicates over accidentally merging them away
  - Do not assume repeated items are duplicates to remove; assume they are separate purchased units unless clearly not products

  Classification rules:
  For each product, determine:
  1. "product_name"
  2. "food_group"
  3. "storage_state"
  4. "product_expiration_date"
  5. "expiration_date_rating"

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
  - If the product wording clearly suggests frozen storage, set "storage_state" to "frozen"
  - Frozen wording or strong frozen clues override fresh produce logic
  - Examples of strong frozen clues include: frozen, fries, chips, wedges, hash browns, ice cream, frozen pizza, frozen vegetables, frozen ready meals
  - Potato chips / fries / wedges bought from a supermarket are often frozen products unless the receipt wording clearly suggests otherwise
  - If "storage_state" is "frozen", do NOT estimate expiry using fresh vegetable, bakery, or chilled rules
  - Frozen foods should usually have expiration estimates in weeks to months, not days

  Critical unopened storage assumption:
  - Unless the receipt explicitly indicates otherwise, assume every product is unopened
  - Assume every product is stored correctly in its proper place after purchase
  - For chilled items, assume correct refrigeration
  - For frozen items, assume correct freezer storage
  - For ambient items, assume normal cupboard or pantry storage
  - Estimate shelf life based on unopened products stored correctly, not opened products
  - Do NOT shorten expiry because of opened-package assumptions
  - Prefer typical manufacturer unopened shelf life over opened-at-home usage life
  - For products like cream, yoghurt, cheese, butter, sauces, and packaged dairy, assume unopened refrigerated shelf life unless the receipt clearly indicates otherwise

  Expiry rules:
  - "product_expiration_date" must be exactly one date in DD-MM-YYYY format or null
  - If a printed expiry is visible on the receipt, use it
  - Otherwise estimate from "dateOfPurchase"
  - If no reliable estimate is possible, use null
  - Always be conservative
  - Always subtract 1 day from the chosen shelf-life estimate
  - Conservative does NOT mean unrealistically short; use realistic unopened shelf life for correctly stored products

  Shelf-life estimation rules:
  - Fresh meat or seafood: 1-3 days
  - Packaged meat: 5-7 days
  - Milk and fresh dairy: 5-7 days
  - Double cream, whipping cream, single cream, and similar unopened chilled cream products: often substantially longer than fresh milk; use a realistic unopened chilled estimate, often weeks rather than days, unless the product appears freshly prepared
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

  Quality rules:
  - Do not ignore repeated products
  - Do not ignore fallback dates
  - Do not leave obvious abbreviations unexpanded
  - Prefer correct grouping over minimal extraction
  - If a product appears to be frozen, do not assign a short fresh-food expiry
  - Final check before output: make sure repeated products and quantity-based multiples are represented as separate product objects
  - Final check before output: make sure unopened packaged dairy and chilled products are not given unrealistically short expiry dates

  Return exactly this JSON schema shape and nothing else:
  {
    "purchase_info": {
      "dateOfPurchase": null,
      "dateOfScan": "${currentDate}",
      "supermarket": null
    },
    "products": [
      {
        "product_name": null,
        "food_group": null,
        "storage_state": null,
        "product_expiration_date": null,
        "expiration_date_rating": null
      }
    ]
  }`;

    const handleTakePhoto = async () => {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();

        if (!granted) {
            Alert.alert('Permission required', 'Camera access is needed to scan receipts.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            base64: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
            setReceipt(null);
        }
    };

    const handleScanReceipt = async () => {
        if (!image || !image.base64) return;

        setLoading(true);
        setReceipt(null);

        try {
            const mimeType = getMimeType(image.uri);

            const result = await openai.chat.completions.create({
                model: 'gpt-4o',
                temperature: 0,
                max_tokens: 1000,
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:${mimeType};base64,${image.base64}`,
                                    detail: 'high',
                                },
                            },
                            {
                                type: 'text',
                                text: PROMPT,
                            },
                        ],
                    },
                ],
            });

            const text = result.choices[0]?.message?.content ?? '';
            const parsed = safeParseJson(String(text));
            setReceipt(parsed);
        } catch (err) {
            Alert.alert('Error', 'Could not scan receipt. Try a clearer photo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Receipt Scanner</Text>

            <TouchableOpacity style={styles.uploadArea} onPress={handleTakePhoto}>
                {image ? (
                    <Image source={{ uri: image.uri }} style={styles.preview} />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.cameraIcon}>📷</Text>
                        <Text style={styles.placeholderText}>Tap to take a photo of your receipt</Text>
                    </View>
                )}
            </TouchableOpacity>

            {image && (
                <TouchableOpacity
                    style={[styles.btn, loading && styles.btnDisabled]}
                    onPress={handleScanReceipt}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.btnText}>Scan Receipt</Text>
                    )}
                </TouchableOpacity>
            )}

            {receipt && (
                <View style={styles.jsonContainer}>
                    <Text style={styles.jsonLabel}>RAW JSON RESPONSE</Text>
                    <View style={styles.jsonBox}>
                        <Text style={styles.jsonText}>
                            {JSON.stringify(receipt, null, 2)}
                        </Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: 30
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
    marginBottom: 20,
  },
  uploadArea: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#bbb',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#fff',
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
    padding: 40,
  },
  cameraIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnDisabled: {
    backgroundColor: '#555',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  jsonContainer: {
    marginTop: 4,
  },
  jsonLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  jsonBox: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#d4d4d4',
    lineHeight: 20,
  },
});