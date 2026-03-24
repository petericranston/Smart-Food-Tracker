import { SafeAreaView } from "react-native-safe-area-context"
import { Text, StyleSheet, View, TextInput } from "react-native"
import { RFValue } from 'react-native-responsive-fontsize';
import DashboardWidget from "../components/dashboardWidget";
import { Feather } from "@expo/vector-icons"

export default function Home(){

    const dummyItems = ["chicken", "beef", "yogurt", "milk", "eggs", "broccoli", "apples", "mango", "cake", "cream", "protein shake", "mayo", "bread"];
    const dummyExpiring = ["chicken", "milk", "cake"];

    return(
        <>
            <SafeAreaView style={styles.container}>
                <Text style={styles.h2} >Good day</Text>
                <Text style={styles.h1} >Your Kitchen</Text>

                <View style={styles.mainContent}>
                    {/* search bar */}
                    <View style={styles.searchBar}>
                        <Feather name="search" size={18} color="#697665" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search items..."
                            placeholderTextColor="#697665"
                        />
                    </View>

                    <View style={ styles.dashWidgetContainer}>
                        <DashboardWidget count={dummyItems.length} title="Items Tracked"/>
                        <DashboardWidget count={dummyExpiring.length} title="Expiring Soon"/>
                    </View>

                </View>
            </SafeAreaView>
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
    mainContent: {
        paddingLeft: 9,
        maxWidth: "97%"
    },
    h2: {
        fontSize: RFValue(14),
        color: "#707070",
        fontFamily: 'Inter_500Medium',
        marginBottom: 20
    },
    h1: {
        fontSize: RFValue(24),
        fontFamily: 'Inter_600SemiBold'
    },
    dashWidgetContainer: {
        marginTop: 50, 
        alignItems: "center", 
        flexDirection: "row", 
        gap: 15, 
        shadowColor: "#000", 
        shadowOffset: {width: -5, height: 5}, 
        shadowOpacity: 0.2, 
        shadowRadius: 5, 
        // Android
        elevation: 4 
    },
    searchBar: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#7E9E7450",
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        paddingTop: 1,
        fontSize: RFValue(12),
        color: "#000",
    }
})