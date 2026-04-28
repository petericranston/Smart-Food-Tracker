import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RFValue } from "react-native-responsive-fontsize";

export default function RecipeDetail({ recipe, onClose }) {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={true}
            transparent={false}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { paddingTop: insets.top + 15 }]}>
                <TouchableOpacity onPress={onClose} style={{ alignSelf: "flex-end", paddingHorizontal: 25 }}>
                    <Text style={{ fontSize: 24, marginBottom: 10 }}>✕</Text>
                </TouchableOpacity>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Green hero section */}
                    <View style={styles.hero}>
                        <View style={styles.expiringBadge}>
                            <Text style={styles.expiringText}>USES EXPIRING</Text>
                        </View>
                        <Text style={styles.emoji}>{recipe.dishEmoji}</Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.title}>{recipe.name}</Text>

                        <View style={styles.metaRow}>
                            <Text style={styles.metaText}>⌛ {recipe.time}</Text>
                            <Text style={styles.metaText}>👨 Serves {recipe.serves}</Text>
                            <View style={styles.expBadge}>
                                <Text style={styles.expBadgeText}>USES EXPIRING</Text>
                            </View>
                        </View>

                        <View style={styles.ingredientsPill}>
                            <View style={styles.pillCircle}>
                                <Text style={styles.pillNumber}>{recipe.ingredients}</Text>
                            </View>
                            <Text style={styles.pillText}>Use's {recipe.ingredients} of your ingredients</Text>
                        </View>

                        <View style={styles.divider} />

                        <Text style={styles.sectionTitle}>Ingredients:</Text>
                        {recipe.ingredientsList.map((ingredient, index) => (
                            <View key={index} style={styles.bulletRow}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>{ingredient}</Text>
                            </View>
                        ))}

                        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Instructions:</Text>
                        {recipe.steps.map((step, index) => (
                            <View key={index} style={styles.bulletRow}>
                                <Text style={styles.bullet}>{index + 1}.</Text>
                                <Text style={styles.bulletText}>{step}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F5EC",
    },
    hero: {
        backgroundColor: "#59AA3F",
        marginHorizontal: 25,
        borderRadius: 20,
        paddingBottom: 30,
        alignItems: "center",
    },
    expiringBadge: {
        alignSelf: "flex-end",
        backgroundColor: "#D50000",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 12,
    },
    expiringText: {
        color: "white",
        fontSize: 8,
    },
    emoji: {
        fontSize: 80,
    },
    content: {
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: RFValue(22),
        fontFamily: "Inter_600SemiBold",
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
    },
    metaText: {
        fontSize: RFValue(12),
        color: "#444",
        fontFamily: "Inter_500Medium",
    },
    expBadge: {
        backgroundColor: "#D50000",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    expBadgeText: {
        color: "white",
        fontSize: 8,
        fontFamily: "Inter_600SemiBold",
    },
    ingredientsPill: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2E6E1A28",
        borderRadius: 10,
        padding: 12,
        gap: 12,
        marginBottom: 20,
    },
    pillCircle: {
        backgroundColor: "#50863F",
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    pillNumber: {
        color: "white",
        fontFamily: "Inter_600SemiBold",
        fontSize: RFValue(13),
    },
    pillText: {
        fontSize: RFValue(13),
        fontFamily: "Inter_600SemiBold",
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: "#00000015",
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: RFValue(16),
        fontFamily: "Inter_600SemiBold",
        marginBottom: 12,
    },
    bulletRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 8,
    },
    bullet: {
        fontSize: RFValue(13),
        fontFamily: "Inter_500Medium",
        color: "#333",
    },
    bulletText: {
        flex: 1,
        fontSize: RFValue(13),
        fontFamily: "Inter_500Medium",
        color: "#333",
    },
})