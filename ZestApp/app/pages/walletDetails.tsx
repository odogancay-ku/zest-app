import React, {useEffect, useState} from "react";
import {ScrollView, View, Alert, Modal, StyleSheet, TouchableOpacity} from "react-native";
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {Text, Card, Button, useTheme, Divider} from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import {fetchBalance} from "@/app/wallet-import";

import {TransactionHistory, Wallet} from "@/models/models";
import LoadingOverlay from "@/app/widgets/LoadingOverlay"; // Adjust the import path as needed
import QRCode from 'react-qr-code';
import createStyles from "@/app/styles/styles";
import TransactionHistoryTable from "@/app/widgets/TransactionHistoryTable"; // Adjust import path as needed

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
    const {selectedWalletId = 0} = useLocalSearchParams();
    const [wallet, setWallet] = useState<Wallet | null>(null);

    const [qrModalVisible, setQrModalVisible] = useState(false);

    const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const router = useRouter();
    const styles = createStyles(theme);

    useEffect(() => {
        const fetchWalletDetails = async () => {
            setLoading(true);
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
                    const wallet = {...selectedWallet, balance};
                    setWallet(wallet);

                    const transactions = await fetchTransactions(selectedWallet.address);
                    setWalletTransactions(transactions);
                } else {
                    setWallet(null);
                }
            } catch (error) {
                console.error("Error fetching wallet details:", error);
                setWallet(null);
            } finally {
                setLoading(false);
            }
        };

        fetchWalletDetails();
    }, [selectedWalletId]);

    const handleDeleteWallet = async () => {
        setLoading(true);
        try {
            const storedWallets = await SecureStore.getItemAsync("wallets");
            if (!storedWallets) return;

            const parsedWallets = JSON.parse(storedWallets);
            const updatedWallets = parsedWallets.filter((w: { id: string }) => w.id !== selectedWalletId);

            await SecureStore.setItemAsync("wallets", JSON.stringify(updatedWallets));
            Alert.alert("Success", "Wallet has been deleted.");
            router.push("/");
        } catch (error) {
            Alert.alert("Error", "Failed to delete wallet. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteWallet = () => {
        Alert.alert(
            "Delete Wallet",
            "Are you sure you want to delete this wallet? This action cannot be undone.",
            [
                {text: "Cancel", style: "cancel"},
                {text: "Delete", style: "destructive", onPress: handleDeleteWallet},
            ]
        );
    };

    const showQRCode = () => {
        setQrModalVisible(true);
    };

    const closeQRCode = () => {
        setQrModalVisible(false);
    };

    return (
        <SafeAreaView style={{flex: 1, padding: 10, backgroundColor: theme.colors.background, gap: 20}}>
            <Stack.Screen
                options={{
                    title: `Wallet Details for wallet ${selectedWalletId}`,
                    headerStyle: {backgroundColor: theme.colors.primaryContainer},
                    headerTintColor: theme.colors.onPrimary,
                    headerTitleStyle: {fontWeight: "bold"},
                    headerBackButtonDisplayMode: "minimal",
                }}
            />

            {/* Show Loading Overlay if loading */}
            {loading && <LoadingOverlay message="Fetching wallet details..."/>}

            {!loading && wallet ? (
                <>
                    <Card>
                        <Card.Title title={wallet.name}/>
                        <Divider/>
                        <View style={{gap: 10, padding: 10}}>
                            <Text>Balance: ${wallet.balance}</Text>
                            <Text>Network: {wallet.network}</Text>
                        </View>
                    </Card>


                    <Text variant="titleMedium">Transaction History</Text>
                    <Card mode="outlined" style={{flex: 1}}>
                        <Card.Content>
                            <ScrollView>
                                <Divider style={{marginBottom: 10}}/>
                                <View key={1} style={{flexDirection: "row", justifyContent: "space-between"}}>
                                    <Text>Date</Text>
                                    <Text>Type</Text>
                                    <Text>Amount</Text>
                                </View>
                                <Divider style={{marginVertical: 10}}/>
                                {walletTransactions.length > 0 ? (
                                    walletTransactions.map((transaction) => (
                                        <View
                                            key={transaction.id}
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                marginBottom: 10,
                                            }}
                                        >
                                            <Text>{transaction.date}</Text>
                                            <Text>{transaction.type}</Text>
                                            <Text>${transaction.amount}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={{textAlign: "center", color: theme.colors.primary}}>
                                        No transactions available.
                                    </Text>
                                )}
                            </ScrollView>
                        </Card.Content>
                    </Card>
                    <View style={{marginTop: 10}}>
                        <Button mode="contained" color={theme.colors.error} onPress={showQRCode}>
                            Show QR
                        </Button>
                    </View>
                    <View style={{marginTop: 0}}>
                        <TransactionHistoryTable
                            isFetching={loading}
                            onRefresh={async () => {
                                setLoading(true);
                                const transactions = await fetchTransactions(wallet.address);
                                setWalletTransactions(transactions);
                                setLoading(false);
                            }}
                            currentTransactions={walletTransactions}
                            handleTransactionClick={(tx) => {
                                setSelectedTransaction(tx);
                                setModalVisible(true);
                            }}
                            currentWallet={wallet}
                            modalVisible={modalVisible}
                            setModalVisible={setModalVisible}
                            selectedTransaction={selectedTransaction}
                        />

                        <View style={{marginTop: 20}}>
                            <Button mode="contained" color={theme.colors.error} onPress={confirmDeleteWallet}>
                                Delete This Wallet
                            </Button>
                        </View>
                        {/* Show QR Code */}
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={qrModalVisible}
                            onRequestClose={closeQRCode}
                        >
                            <View style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                            }}>
                                <View style={{
                                    width: 300,
                                    backgroundColor: "white",
                                    padding: 50,
                                    borderRadius: 10,
                                    alignItems: "center",
                                    elevation: 5,
                                }}>
                                    <View>
                                        {selectedWalletId && (
                                            <QRCode
                                                value={wallet.address.toString()}
                                                bgColor="#FFFFFF"
                                                fgColor="#000000"
                                                size={200}
                                            />
                                        )}
                                    </View>
                                    <TouchableOpacity style={{
                                        marginTop: 20,
                                        padding: 10,
                                        borderRadius: 5,
                                        backgroundColor: "#2196F3",
                                    }} onPress={closeQRCode}>
                                        <Text>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </>
            ) : (
                !loading && (
                    <Text style={{color: "red", textAlign: "center", marginVertical: 20}}>
                        Wallet not found.
                    </Text>
                )
            )}

        </SafeAreaView>
    );
}