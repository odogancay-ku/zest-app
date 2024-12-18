import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Card, Divider, useTheme } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { fetchBalance } from "@/app/wallet-import";

interface TransactionHistory {
    id: number;
    walletId: string;
    amount: number;
    date: string;
    type: string;
}

const mockAll: TransactionHistory[] = [
    { id: 1, walletId: "1", amount: 100, date: "2021-09-01", type: "deposit" },
    { id: 2, walletId: "1", amount: 200, date: "2021-09-02", type: "withdraw" },
    { id: 3, walletId: "2", amount: 300, date: "2021-09-03", type: "deposit" },
    { id: 4, walletId: "3", amount: 400, date: "2021-09-04", type: "withdraw" },
];

export default function WalletDetails() {
    const { selectedWalletId = 0 } = useLocalSearchParams();
    const [wallet, setWallet] = useState(null);
    const [walletTransactions, setWalletTransactions] = useState<TransactionHistory[]>([]);
    const theme = useTheme();

    useEffect(() => {
        const fetchWalletDetails = async () => {
            console.log(selectedWalletId);
            const storedWallets = await SecureStore.getItemAsync("wallets");
            if (!storedWallets) {
                setWallet(null);
                return;
            }

            const parsedWallets = JSON.parse(storedWallets);
            const selectedWallet = parsedWallets.find((w: { id: string }) => w.id == selectedWalletId);

            if (selectedWallet) {
                console.log(selectedWallet);
                const balance = await fetchBalance(selectedWallet.address);
                setWallet({ ...selectedWallet, balance });
                const filteredTransactions = mockAll.filter(
                    (transaction) => transaction.walletId === selectedWalletId
                );
                setWalletTransactions(filteredTransactions);
            } else {
                setWallet(null);
            }
        };

        fetchWalletDetails();
    }, [selectedWalletId]);

    return (
        <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: theme.colors.background, gap: 20 }}>
            <Stack.Screen
                options={{
                    title: "Wallet Details for wallet " + selectedWalletId,
                    headerStyle: { backgroundColor: theme.colors.primaryContainer },
                    headerTintColor: theme.colors.onPrimary,
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerBackButtonDisplayMode: "minimal",
                }}
            />

            {wallet ? (
                <Card mode="outlined">
                    <Card.Title title={wallet.name} />
                    <Card.Content>
                        <Text>Balance: ${wallet.balance}</Text>
                        <Text>Network: {wallet.network}</Text>
                    </Card.Content>
                </Card>
            ) : (
                <Text style={{ color: "red", textAlign: "center", marginVertical: 20 }}>Wallet not found.</Text>
            )}

            <Text variant="titleMedium">Transaction History</Text>
            <Card mode="outlined" style={{ flex: 1 }}>
                <Card.Content>
                    <ScrollView>
                        <Divider style={{ marginBottom: 10 }} />
                        <View key={1} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>Date</Text>
                            <Text>Type</Text>
                            <Text>Amount</Text>
                        </View>
                        <Divider style={{ marginVertical: 10 }} />
                        {walletTransactions.length > 0 ? (
                            walletTransactions.map((transaction) => (
                                <View
                                    key={transaction.id}
                                    style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}
                                >
                                    <Text>{transaction.date}</Text>
                                    <Text>{transaction.type}</Text>
                                    <Text>${transaction.amount}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={{ textAlign: "center", color: theme.colors.primary }}>
                                No transactions available.
                            </Text>
                        )}
                    </ScrollView>
                </Card.Content>
            </Card>
        </SafeAreaView>
    );
}
