import React, { useEffect, useState } from "react";
import { ScrollView, View, Alert } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Card, Divider, Button, useTheme } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { fetchBalance } from "@/app/wallet-import";
import { Wallet } from "@/models/models";
import LoadingOverlay from "@/app/widgets/LoadingOverlay"; // Adjust the import path as needed

const fetchTransactions = async (address: string) => {
    const url = `https://blockstream.info/testnet/api/address/${address}/txs`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch transactions");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export default function WalletDetails() {
    const { selectedWalletId = 0 } = useLocalSearchParams();
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // Loading state
    const theme = useTheme();
    const router = useRouter();

    useEffect(() => {
        const fetchWalletDetails = async () => {
            setLoading(true); // Show loading spinner
            try {
                const storedWallets = await SecureStore.getItemAsync("wallets");
                if (!storedWallets) {
                    setWallet(null);
                    setLoading(false);
                    return;
                }

                const parsedWallets = JSON.parse(storedWallets);
                const selectedWallet = parsedWallets.find((w: { id: string }) => w.id == selectedWalletId);

                if (selectedWallet) {
                    const balance = await fetchBalance(selectedWallet.address, selectedWallet.network);
                    const wallet = { ...selectedWallet, balance };
                    setWallet(wallet);

                    // Fetch transactions for this wallet
                    const transactions = await fetchTransactions(selectedWallet.address);
                    setWalletTransactions(transactions);
                } else {
                    setWallet(null);
                }
            } catch (error) {
                console.error("Error fetching wallet details:", error);
                setWallet(null);
            } finally {
                setLoading(false); // Hide loading spinner
            }
        };

        fetchWalletDetails();
    }, [selectedWalletId]);

    const handleDeleteWallet = async () => {
        setLoading(true); // Show loading spinner
        try {
            const storedWallets = await SecureStore.getItemAsync("wallets");
            if (!storedWallets) return;

            const parsedWallets = JSON.parse(storedWallets);
            const updatedWallets = parsedWallets.filter((w: { id: string }) => w.id !== selectedWalletId);

            await SecureStore.setItemAsync("wallets", JSON.stringify(updatedWallets));
            Alert.alert("Success", "Wallet has been deleted.");
            router.push("/"); // Redirect to the index page after deleting
        } catch (error) {
            Alert.alert("Error", "Failed to delete wallet. Please try again.");
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    const confirmDeleteWallet = () => {
        Alert.alert(
            "Delete Wallet",
            "Are you sure you want to delete this wallet? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: handleDeleteWallet },
            ]
        );
    };

    const calculateNetBalance = (tx: any, address: string) => {
        const incoming = tx.vout
            .filter((output: any) => output.scriptpubkey_address === address)
            .reduce((sum: number, output: any) => sum + output.value, 0);

        const outgoing = tx.vin
            .filter((input: any) => input.prevout?.scriptpubkey_address === address)
            .reduce((sum: number, input: any) => sum + input.prevout.value, 0);

        return incoming - outgoing; // Positive for incoming, negative for outgoing
    };

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

            {/* Show Loading Overlay if loading */}
            {loading && <LoadingOverlay message="Fetching wallet details..." />}

            {!loading && wallet ? (
                <>
                    <Card mode="outlined">
                        <Card.Title title={wallet.name} />
                        <Card.Content>
                            <Text>Balance: ${wallet.balance}</Text>
                            <Text>Network: {wallet.network}</Text>
                        </Card.Content>
                    </Card>

                    <Text variant="titleMedium">Transaction History</Text>
                    <Card mode="outlined" style={{ flex: 1 }}>
                        <Card.Content>
                            <ScrollView>
                                <Divider style={{ marginBottom: 10 }} />
                                <View key={1} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text>Date</Text>
                                    <Text>Status</Text>
                                    <Text>Net Balance</Text>
                                </View>
                                <Divider style={{ marginVertical: 10 }} />
                                {walletTransactions.length > 0 ? (
                                    walletTransactions.map((transaction) => (
                                        <View
                                            key={transaction.status.block_time}
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                marginBottom: 10,
                                            }}
                                        >
                                            <Text>{new Date(transaction.status.block_time * 1000).toLocaleDateString()}</Text>
                                            <Text>{transaction.status.confirmed ? "Confirmed" : "Pending"}</Text>
                                            <Text>
                                                {calculateNetBalance(transaction, wallet.address) > 0 ? "+" : ""}
                                                {calculateNetBalance(transaction, wallet.address)}
                                            </Text>
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

                    <View style={{ marginTop: 20 }}>
                        <Button mode="contained" color={theme.colors.error} onPress={confirmDeleteWallet}>
                            Delete This Wallet
                        </Button>
                    </View>
                </>
            ) : (
                !loading && (
                    <Text style={{ color: "red", textAlign: "center", marginVertical: 20 }}>
                        Wallet not found.
                    </Text>
                )
            )}
        </SafeAreaView>
    );
}
