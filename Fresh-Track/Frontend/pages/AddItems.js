import { Text, StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Modal, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RFValue } from 'react-native-responsive-fontsize';
import ItemInput from "../components/ItemInput";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import ReceiptScanner from "../components/ReceiptScanner";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddItems() {
  const insets = useSafeAreaInsets();

  const [scannedItems, setScannedItems] = useState([]);

  const formatExpiry = (expiryDate) => {
    if (!expiryDate) return "-/-";
    const date = new Date(expiryDate);
    const now = new Date();

    // show full date if it's more than a year away
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

  // Modal visibles
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [barcodeVisible, setBarcodeVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

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

            {/* line */}
            <View
            style={{
                height: 1,
                backgroundColor: "#B5B5B549",
                marginTop: 25,
                // iOS
                shadowColor: "#000000",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 4,

                // Android
                elevation: 4,
            }}
            />

            <View
            style={{
                marginTop: 25,
                padding: 15,
                borderColor: "#B5B5B550",
                borderWidth: 2,
            }}
            >
            {scannedItems.length > 0 ? (
                scannedItems.map((item) => {
                const displayUnit = item.unit
                    ? `${item.quantity} x ${item.unit}`
                    : `${item.quantity} x`;

                return (
                    <View style={styles.itemsRow} key={item.id}>
                    <Text style={{ fontSize: RFValue(14) }}>
                        {displayUnit} {item.name}
                    </Text>
                    <Text style={{ color: "#888", fontSize: RFValue(14) }}>
                        {formatExpiry(item.expiryDate)}
                    </Text>
                    </View>
                );
                })
            ) : (
                <Text style={{ textAlign: "center", fontSize: RFValue(14) }}>
                Added items will show here!
                </Text>
            )}
            </View>
        </SafeAreaView>

      {/* ---------Modals--------- */}
      {/* Receipt modal */}
      <Modal
        visible={receiptVisible}
        transparent={false}
        statusBarTranslucent={true}
        animationType="slide"
        onRequestClose={() => setReceiptVisible(false)} // Android back button
      >
        <SafeAreaView
          style={[styles.modalContainer, { paddingTop: insets.top + 15 }]}
        >
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
                      .join("-") // converts DD-MM-YYYY to YYYY-MM-DD
                  : null,
                foodGroup: product.food_group,
                storageState: product.storage_state,
              }));
              setScannedItems(mapped);
              setReceiptVisible(false); // close modal after scan
            }}
          />
        </SafeAreaView>
      </Modal>

      {/* Barcode modal */}
      <Modal
        visible={barcodeVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setBarcodeVisible(false)} // Android back button
      >
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => setBarcodeVisible(false)}
            style={{ alignSelf: "flex-end" }}
          >
            <Text style={{ fontSize: 24 }}>✕</Text>
          </TouchableOpacity>
          <Text>Barcode</Text>
        </SafeAreaView>
      </Modal>

                <View style={{ marginTop: 25, padding: 15, borderColor: "#B5B5B550", borderWidth: 2, maxHeight: 300, minHeight: 50}}>
                   <FlatList
                        data={scannedItems}
                        keyExtractor={(item) => item.id.toString()}
                        ListEmptyComponent={
                        <Text style={{ textAlign: "center", fontSize: RFValue(14) }}>
                            Added items will show here! -work
                        </Text>
                        }
                        renderItem={({ item }) => {
                            const displayUnit = item.unit ? `${item.quantity} x ${item.unit}` : `${item.quantity} x`;
                            return (
                                <View style={styles.itemsRow}>
                                <Text numberOfLines={3} style={{ fontSize: RFValue(14), width: "70%" }}>
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

            </SafeAreaView>

        {/* ---------Modals--------- */}
            {/* Receipt modal */}
            <Modal
                visible={receiptVisible}
                transparent={false}
                statusBarTranslucent={true}
                animationType="slide"
                onRequestClose={() => setReceiptVisible(false)}  // Android back button
            >
                <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top + 15}]}>
                    <TouchableOpacity 
                        onPress={() => setReceiptVisible(false)}
                        style={{ alignSelf: 'flex-end' }}
                    >
                        <Text style={{ fontSize: 24 }}>✕</Text>
                    </TouchableOpacity>
                    <ReceiptScanner onScanComplete={(data) => {
                        const mapped = data.products.map((product, index) => ({
                            id: index + 1,
                            name: product.product_name,
                            expiryDate: product.product_expiration_date 
                                ? product.product_expiration_date.split('-').reverse().join('-') // converts DD-MM-YYYY to YYYY-MM-DD
                                : null,
                            foodGroup: product.food_group,
                            storageState: product.storage_state,
                        }));
                        setScannedItems(mapped);
                        setReceiptVisible(false); // close modal after scan
                    }} />
                </SafeAreaView>
            </Modal>

            {/* Barcode modal */}
            <Modal
                visible={barcodeVisible}
                transparent={false}
                animationType="slide"
                onRequestClose={() => setBarcodeVisible(false)}  // Android back button
            >
                <SafeAreaView style={styles.modalContainer}>
                    <TouchableOpacity 
                        onPress={() => setBarcodeVisible(false)}
                        style={{ alignSelf: 'flex-end' }}
                    >
                        <Text style={{ fontSize: 24 }}>✕</Text>
                    </TouchableOpacity>
                    <Text>Barcode</Text>
                </SafeAreaView>
            </Modal>

            {/* Search modal */}
            <Modal
                visible={searchVisible}
                transparent={false}
                animationType="slide"
                onRequestClose={() => setSearchVisible(false)}  // Android back button
            >
                <SafeAreaView style={styles.modalContainer}>
                    <TouchableOpacity 
                        onPress={() => setSearchVisible(false)}
                        style={{ alignSelf: 'flex-end' }}
                    >
                        <Text style={{ fontSize: 24 }}>✕</Text>
                    </TouchableOpacity>
                    <Text>Search</Text>
                </SafeAreaView>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5EC",
    paddingTop: 20,
    paddingLeft: 25,
    paddingRight: 25,
  },
  // this is because the modal kept bugging and would have a broken view
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
});
