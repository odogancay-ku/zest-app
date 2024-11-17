import React from 'react';
import {StyleSheet, View, Text, ScrollView, Pressable} from 'react-native';
import {Link, useNavigation} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {FontAwesome6, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import UserAccountCard from "@/components/AccountCard";
import {SafeAreaView} from "react-native-safe-area-context";

export default function HomeScreen() {

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <UserAccountCard userId={1}/>
            <View style={styles.walletAction}>
                <Link href="../other/atomicSwap" asChild>
                    <Pressable style={styles.circularButton}>
                        <MaterialIcons name="currency-exchange" size={24} color="black" />
                    </Pressable>
                </Link>
                <Link href="../other/transaction" asChild>
                    <Pressable style={styles.circularButton}>
                        <FontAwesome6 name="money-bill-transfer" size={24} color="black"/>
                    </Pressable>
                </Link>
                <Link href="../other/walletDetails" asChild>
                    <Pressable style={styles.circularButton}>
                        <MaterialCommunityIcons name="card-account-details" size={24} color="black"/>
                    </Pressable>
                </Link>
            </View>

            <View style={styles.detailsSection}>
                <Text style={styles.detailsText}>
                    Wallet Details
                </Text>
                <Text style={styles.detailsText}>
                    Some recent transactions ???
                </Text>
            </View>

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "yellow",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 10,

    },

    walletContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    walletCard: {
        width: 200,
        height: 100,
        backgroundColor: "#ffffff",
        marginHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },

    walletAction: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "yellow",
        marginBottom: 100,
        width: "100%",
    },

    circularButton: {
        width: 75,
        height: 75,
        borderRadius: 70,
        backgroundColor: 'Lightgrey',
        justifyContent: 'space-around',
        padding: 23,
    },

    detailsSection: {
        marginVertical: 20,
        backgroundColor: "green",
        height:200,
        borderColor: "#555555",
        borderWidth: 3,
        justifyContent: "center",

    },

    detailsText: {
        fontSize: 16,
        color: "#555555",
    }
});

