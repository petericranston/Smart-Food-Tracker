import { Text, StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RFValue } from 'react-native-responsive-fontsize';
import ItemInput from "../components/ItemInput";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { useState } from "react";
import ReceiptScanner from "../components/ReceiptScanner";

export default function AddItems(){
    const [scannedItems, setScannedItems] = useState([
        { id: 1, quantity: 1, unit: "1kg", name: "Chicken Breast", expiryDate: "2026-03-07" },
        { id: 2, quantity: 1, unit: "2kg", name: "Basmati Rice", expiryDate: null },
        { id: 3, quantity: 2, unit: null, name: "Tender Stem Broccoli", expiryDate: "2026-03-06" },
        { id: 4, quantity: 3, unit: null, name: "Frozen Raspberries", expiryDate: "2027-04-10" },
        { id: 5, quantity: 3, unit: "1kg", name: "Skyr Yogurt", expiryDate: "2026-03-16" }
    ]);

    const formatExpiry = (expiryDate) => {
        if (!expiryDate) return "-/-";
        const date = new Date(expiryDate);
        const now = new Date();

        // show full date if it's more than a year away
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(now.getFullYear() + 1);

        if (date > oneYearFromNow) {
            return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
        }

        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });
    };

    // Modal visibles
    const [receiptVisible, setReceiptVisible] = useState(false);
    const [barcodeVisible, setBarcodeVisible] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);

    return(
        <>
            <SafeAreaView style={styles.container}>
                <Text style={styles.h1} >Add items</Text>
                <Text style={styles.h2} >Choose how to add your food</Text>

                <View style={{alignItems: "center", marginTop: 15}}>
                    <View style={{ flexDirection: "row", gap: 20, marginBottom: 23}}>
                        <ItemInput inputChoice={"Scan receipt"} onPressFunction={() => setReceiptVisible(true)}>
                            <Ionicons name="receipt-outline" color="white" size={40}/>
                        </ItemInput>
                        <ItemInput inputChoice={"Scan barcode"} onPressFunction={() => setBarcodeVisible(true)}>
                            <Ionicons name="barcode-outline" size={40} color="white" />
                        </ItemInput>
                    </View>
                    
                    <ItemInput inputChoice={"Search item"} onPressFunction={() => setSearchVisible(true)}>
                        <Feather name="search" size={40} color="white" />
                    </ItemInput>
                </View>

                {/* line */}
                <View style={{ 
                    height: 1, 
                    backgroundColor: '#B5B5B549', 
                    marginTop: 25,
                    // iOS
                    shadowColor: '#000000',
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 4,

                    // Android
                    elevation: 4,
                }} />

                <View style={{ marginTop: 25, padding: 15, borderColor: "#B5B5B550", borderWidth: 2}}>
                    {scannedItems.map((item) => {
                        const displayUnit = item.unit ? `${item.quantity} x ${item.unit}` : `${item.quantity} x`;

                        return (
                            <View style={styles.itemsRow} key={item.id}>
                                <Text style={{ fontSize: RFValue(14) }}>{displayUnit} {item.name}</Text>
                                <Text style={{ color: "#888", fontSize: RFValue(14) }}>{formatExpiry(item.expiryDate)}</Text>
                            </View>
                        );
                    })}
                </View>

            </SafeAreaView>

        {/* ---------Modals--------- */}
            {/* Receipt modal */}
            <Modal
                visible={receiptVisible}
                transparent={false}
                animationType="slide"
                onRequestClose={() => setReceiptVisible(false)}  // Android back button
            >
                <SafeAreaView style={styles.modalContainer}>
                    <TouchableOpacity 
                        onPress={() => setReceiptVisible(false)}
                        style={{ alignSelf: 'flex-end' }}
                    >
                        <Text style={{ fontSize: 24 }}>✕</Text>
                    </TouchableOpacity>
                    <ReceiptScanner />
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
        paddingRight: 25
    },
    // this is because the modal kept bugging and would have a broken view
    modalContainer: {
        flex: 1,
        backgroundColor: "#F8F5EC",
        paddingTop: 15,
        paddingLeft: 30,
        paddingRight: 30
    },
    h2: {
        fontSize: RFValue(14),
        color: "#707070",
        fontFamily: 'Inter_500Medium',
        marginBottom: 20,
        textAlign: "center"
    },
    h1: {
        fontSize: RFValue(24),
        fontFamily: 'Inter_600SemiBold',
        textAlign: "center",
        marginBottom: 5
    },
    itemsRow: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        paddingVertical: 6,
    }
})