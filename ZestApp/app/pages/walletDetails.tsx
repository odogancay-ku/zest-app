import React from "react";
import { ScrollView, View } from 'react-native';
import {Stack, useLocalSearchParams} from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import {Text, Card, Divider, useTheme} from 'react-native-paper';

interface TransactionHistory {
    id: number;
    walletId: number;
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
    { id: 1, walletId: 1, amount: 100, date: '2021-09-01', type: 'deposit' },
    { id: 2, walletId: 1, amount: 200, date: '2021-09-02', type: 'withdraw' },
    { id: 3, walletId: 2, amount: 300, date: '2021-09-03', type: 'deposit' },
    { id: 4, walletId: 3, amount: 400, date: '2021-09-04', type: 'withdraw' },
];

const mockCards: Cards[] = [
    { id: 1, name: 'Wallet 1', balance: 1000 },
    { id: 2, name: 'Wallet 2', balance: 2000 },
    { id: 3, name: 'Wallet 3', balance: 3000 },
];

export default function WalletDetails() {
    const { selectedWalletId = 0 } = useLocalSearchParams();

    const wallet = mockCards.find((card) => card.id == selectedWalletId);
    const walletTransactions = mockAll.filter((transaction) => transaction.walletId == selectedWalletId);

    const theme = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: theme.colors.background, gap: 20}}>

            <Stack.Screen
                options={{
                    title: 'Wallet Details for wallet ' + selectedWalletId,
                    headerStyle: {backgroundColor: theme.colors.primaryContainer},
                    headerTintColor: theme.colors.onPrimary,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />

            {wallet ? (
                <Card mode="outlined">
                    <Card.Title title={wallet.name} />
                    <Card.Content>
                        <Text>Balance: ${wallet.balance}</Text>
                    </Card.Content>
                </Card>
            ) : (
                <Text style={{ color: 'red', textAlign: 'center', marginVertical: 20 }}>Wallet not found.</Text>
            )}

            <Text variant="titleMedium">Transaction History</Text>
            <Card mode="outlined" style={{ flex: 1 }}>
                <Card.Content>
                    <ScrollView>
                        <Divider style={{ marginBottom: 10 }} />
                        <View key={1} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>Date</Text>
                            <Text>Type</Text>
                            <Text>Amount</Text>
                        </View>
                        <Divider style={{ marginVertical: 10 }} />
                        {walletTransactions.length > 0 ? (
                            walletTransactions.map((transaction) => (
                                <View key={transaction.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <Text>{transaction.date}</Text>
                                    <Text>{transaction.type}</Text>
                                    <Text>${transaction.amount}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={{ textAlign: 'center', color: theme.colors.primary }}>No transactions available.</Text>
                        )}
                    </ScrollView>
                </Card.Content>
            </Card>
        </SafeAreaView>
    );
}
