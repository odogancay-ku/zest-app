import { StyleSheet, View, Text, ScrollView } from 'react-native';
import {Stack} from "expo-router";
import React from "react";

import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TransactionHistory {
    id: number;
    cardId: number;
    amount: number;
    date: string;
    type: string;
}

interface Cards {
    id: number;
    name: string;
    balance: number;
}

const mockAll: TransactionHistory[] = [
    { id: 1, cardId: 1, amount: 100, date: '2021-09-01', type: 'deposit' },
    { id: 2, cardId: 1, amount: 200, date: '2021-09-02', type: 'withdraw' },
    { id: 3, cardId: 2, amount: 300, date: '2021-09-03', type: 'deposit' },
    { id: 4, cardId: 3, amount: 400, date: '2021-09-04', type: 'withdraw' },
];

const mockCards: Cards[] = [
    { id: 1, name: 'Card 1', balance: 1000 },
    { id: 2, name: 'Card 2', balance: 2000 },
    { id: 3, name: 'Card 3', balance: 3000 },
];

export default function WalletDetails() {
    const route = useRoute();
    const { selectedWalletId } = route.params as { selectedWalletId: number };
    console.log(selectedWalletId)
    console.log(selectedWalletId == 1)

    const wallet = mockCards.find((card) => card.id == selectedWalletId);
    const walletTransactions = mockAll.filter((transaction) => transaction.cardId == selectedWalletId);

    return (
        <SafeAreaView style={styles.container}>
            {wallet ? (
                <View style={styles.walletDetailsContainer}>
                    <Text style={styles.walletTitle}>{wallet.name}</Text>
                    <Text style={styles.walletBalance}>Balance: ${wallet.balance}</Text>
                </View>
            ) : (
                <Text style={styles.errorText}>Wallet not found.</Text>
            )}

            <Text style={styles.historyTitle}>Transaction History</Text>
            <ScrollView style={styles.transactionHistoryContainer}>
                <View key={1} style={styles.transactionRow}>
                            <Text>{"Date"}</Text>
                            <Text>{"Type"}</Text>
                            <Text>{"Amount"}</Text>
                </View>
                {walletTransactions.length > 0 ? (
                    walletTransactions.map((transaction) => (
                        <View key={transaction.id} style={styles.transactionRow}>
                            <Text>{transaction.date}</Text>
                            <Text>{transaction.type}</Text>
                            <Text>${transaction.amount}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noTransactionsText}>No transactions available.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightyellow',
        padding: 10,
    },
    walletDetailsContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderColor: '#555555',
        borderWidth: 3,
        borderRadius: 10,
        marginBottom: 20,
    },
    walletTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    walletBalance: {
        fontSize: 18,
        marginTop: 10,
    },
    historyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    transactionHistoryContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderColor: '#555555',
        borderWidth: 3,
        borderRadius: 10,
        padding: 10,
    },
    transactionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    noTransactionsText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});
