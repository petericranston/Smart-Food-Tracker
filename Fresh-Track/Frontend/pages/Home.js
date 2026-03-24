import { SafeAreaView } from "react-native-safe-area-context"
import { Text, StyleSheet, View, TextInput } from "react-native"
import { RFValue } from 'react-native-responsive-fontsize';
import DashboardWidget from "../components/dashboardWidget";
import ExpiringWidget from "../components/ExpiringSoonWidget";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Home(){

    const dummyItems = ["chicken", "beef", "yogurt", "milk", "eggs", "broccoli", "apples", "mango", "cake", "cream", "protein shake", "mayo", "bread"];
    const dummyExpiring = [
        {id: 1, name: "chicken", expiryDate: "2026-03-27"},
        {id: 2, name: "milk", expiryDate: "2026-03-30"},
        {id: 3, name: "eggs", expiryDate: "2026-04-03"}
    ];

    const navigation = useNavigation()

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

                    <View style={{ marginTop: 50 }}>
                        {dummyExpiring.length > 0 ? (
                            <>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingRight: 2, marginBottom: 50}}>
                                    <Text style={styles.h3}>Needs Attention</Text>
                                    <Text style={{ color: "#50863F", textDecorationLine: "underline"}} onPress={() => dummyExpiring}>See All</Text>
                                </View>
                                <View>
                                    {
                                        dummyExpiring.map((item) => {
                                            const today = new Date();
                                            const expiry = new Date(dummyExpiring.expiryDate);

                                            const diffTime = expiry - today;
                                            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert ms to days
                                            return <ExpiringWidget 
                                                image={require("../assets/foodplaceholders/mschicken.png")} name={item.name} 
                                                expireMessage={`This item is expiring in ${daysLeft} days!`} expiringIn={daysLeft} 
                                                dateStyling={{backgroundColor: "red", justifyContent: "center"}}
                                            />
                                        })
                                    }
                                </View>
                            </>
                            
                        ) : dummyItems.length > 0 && dummyExpiring.length <= 0 ? (
                            <View><Text>dummy</Text></View>
                        ) : (
                            <View>
                                <Text 
                                    style={{ textDecorationLine: "underline", fontSize: RFValue(20), fontFamily: 'Inter_600SemiBold'}}
                                    onPress={() => navigation.navigate("AddItemsPage")}>Add items to get started
                                </Text>
                            </View>
                        )}
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
    h3: {
        fontSize: RFValue(20),
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