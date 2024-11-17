import React from 'react';
import {StyleSheet, View, Text, ScrollView, Pressable} from 'react-native';
import {Link, useNavigation} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {FontAwesome6, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import UserAccountCard from "@/components/AccountCard";
import {SafeAreaView} from "react-native-safe-area-context";

interface TransactionHistory{
    id: number;
    amount: number;
    date: string;
    type: string;
}

const mockHistory: TransactionHistory[] = []
const mockAll: TransactionHistory[] = []
let selectedWalletId= 0
export default function HomeScreen() {

    let hist1= {id: 1, amount: 100, date: "2021-09-01", type: "deposit"};
    let hist2= {id: 2, amount: 200, date: "2021-09-02", type: "withdraw"};
    let hist3= {id: 3, amount: 300, date: "2021-09-03", type: "deposit"};
    let hist4= {id: 4, amount: 400, date: "2021-09-04", type: "withdraw"};
    mockHistory.push(hist1);
    mockHistory.push(hist2);

    mockAll.push(hist1);
    mockAll.push(hist2);
    mockAll.push(hist3);
    mockAll.push(hist4);

    //All should be visible in the transaction history

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
                <Link href={{
                    pathname:"../other/walletDetails",
                    params: {selectedWalletId}
                }} asChild>
                    <Pressable style={styles.circularButton}>
                        <MaterialCommunityIcons name="card-account-details" size={24} color="black"/>
                    </Pressable>
                </Link>
            </View>

            <View style={styles.detailsSection}>
                <Text style={styles.detailsText}>Transaction History</Text>
                <ScrollView>
                    {mockHistory.map((transaction) => (
                        <View key={transaction.id} style={styles.tableRow}>
                            <Text>{transaction.amount}</Text>
                            <Text>{transaction.date}</Text>
                            <Text>{transaction.type}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "lightblue",
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
        width: "100%",
    },

    circularButton: {
        width: 75,
        height: 75,
        borderRadius: 70,
        backgroundColor: 'lightgrey',
        justifyContent: 'space-around',
        padding: 23,
        margin: 20
    },

    detailsSection: {
        marginVertical: 20,
        backgroundColor: "white",
        height: 300,
        width: "100%",
        borderColor: "#555555",
        borderWidth: 3,
        justifyContent: "center",

    },

    detailsText: {
        fontSize: 24
    },

    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        justifyContent: 'space-between',
    }
});

