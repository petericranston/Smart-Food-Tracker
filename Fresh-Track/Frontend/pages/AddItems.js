import { Text, StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RFValue } from 'react-native-responsive-fontsize';
import ItemInput from "../components/ItemInput";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { useState } from "react";

export default function AddItems(){
    const dummyScan = [
        {id: 1, name: "chicken", expiryDate: "2026-04-10", amount: 1},
        {id: 2, name: "milk", expiryDate: "2026-04-26", amount: 1},
        {id: 3, name: "eggs", expiryDate: "2026-04-23", amount: 2},
        {id: 4, name: "broccoli", expiryDate: "2026-04-09", amount: 2},
        {id: 5, name: "skyr yogurt", expiryDate: "2026-05-20", amount: 3},
    ];

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

            </SafeAreaView>

        {/* ---------Modals--------- */}
            {/* Receipt modal */}
            <Modal
                visible={receiptVisible}
                transparent={false}
                animationType="slide"
                onRequestClose={() => setReceiptVisible(false)}  // Android back button
            >
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity 
                        onPress={() => setReceiptVisible(false)}
                        style={{ alignSelf: 'flex-end' }}
                    >
                        <Text style={{ fontSize: 24 }}>✕</Text>
                    </TouchableOpacity>
                    <Text>Receipt</Text>
                </SafeAreaView>
            </Modal>

            {/* Barcode modal */}
            <Modal
                visible={barcodeVisible}
                transparent={false}
                animationType="slide"
                onRequestClose={() => setBarcodeVisible(false)}  // Android back button
            >
                <SafeAreaView style={styles.container}>
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
                <SafeAreaView style={styles.container}>
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
        paddingTop: 25,
        paddingLeft: 25,
        paddingRight: 25
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
    }
})