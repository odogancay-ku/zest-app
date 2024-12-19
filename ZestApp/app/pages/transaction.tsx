import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { Button, Text, TextInput, useTheme, Surface } from "react-native-paper";
import { ScrollView } from "react-native";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Wallet } from "@/models/models";
import { fetchBalance } from "@/app/wallet-import";
import axios from "axios";
import bitcoin from "bitcoinjs-lib";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

export default function Transaction() {
    const theme = useTheme();
    const [selectedWalletId, setSelectedWalletId] = useState<string>("-1");
    const [receiverWalletAddress, setReceiverWalletAddress] = useState<string>("");
    const [value, setValue] = useState<string>("");
    const [wallets, setWallets] = useState<Wallet[]>([]);

    const fetchWallets = async () => {
        const storedWallets = await SecureStore.getItemAsync("wallets");

        if (storedWallets) {
            const wallets = JSON.parse(storedWallets);
            for (let wallet of wallets) {
                const balance = await fetchBalance(wallet.address);
                console.log(wallet.address, " ", balance);
            }
            setWallets(wallets);
            setSelectedWalletId(wallets[0].id);
        } else {
            console.log("No wallets found.");
            setWallets([]);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    const handleSubmit = async () => {
        const selectedWallet = wallets.find((wallet) => wallet.id === selectedWalletId);
        if (!selectedWallet) {
            alert("Wallet not selected or doesn't exist.");
            return;
        }

        const { address, privateKey } = selectedWallet;

        try {
            // Fetch UTXOs
            const utxoResponse = await axios.get(`https://blockstream.info/testnet/api/address/${address}/utxo`);
            const utxos = utxoResponse.data;

            if (utxos.length === 0) {
                alert("No UTXOs found for this wallet.");
                return;
            }

            // Prepare Transaction
            const network = bitcoin.networks.testnet; // Use testnet for testing
            const txb = new bitcoin.TransactionBuilder(network);
            let inputAmount = 0;

            // Add UTXOs as inputs
            for (let utxo of utxos) {
                txb.addInput(utxo.txid, utxo.vout);
                inputAmount += utxo.value;
            }

            // Amounts in satoshis
            const amountToSend = Math.floor(parseFloat(value) * 1e8); // Convert BTC to satoshis
            const fee = 1000; // Fee in satoshis
            const change = inputAmount - amountToSend - fee;

            if (change < 0) {
                alert("Insufficient funds.");
                return;
            }

            // Add output to the receiver
            txb.addOutput(receiverWalletAddress, amountToSend);

            // Add change output back to the sender
            txb.addOutput(address, change);

            // Sign the inputs
            const keyPair = bitcoin.ECPair.fromWIF(privateKey, network);
            for (let i = 0; i < utxos.length; i++) {
                txb.sign(i, keyPair);
            }

            // Build the raw transaction
            const rawTx = txb.build().toHex();
            console.log("Raw Transaction:", rawTx);

            // Broadcast the transaction
            const broadcastResponse = await axios.post("https://blockstream.info/api/tx", rawTx, {
                headers: { "Content-Type": "text/plain" },
            });

            alert(`Transaction sent! Txid: ${broadcastResponse.data}`);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while creating or broadcasting the transaction.");
        }
    };

    return (
        <KeyboardAwareScrollView style={{ backgroundColor: theme.colors.background }}>
            <Stack.Screen
                options={{
                    title: "Transaction",
                    headerStyle: { backgroundColor: theme.colors.primaryContainer },
                    headerTintColor: theme.colors.onPrimary,
                    headerTitleStyle: { fontWeight: "bold" },
                    headerBackButtonDisplayMode: "minimal",
                }}
            />
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 16, gap: 10 }}>
                {/* Wallet Picker */}
                <Surface style={{ padding: 16, elevation: 2 }}>
                    <Text variant="headlineSmall">Choose Wallet</Text>
                    <Picker
                        selectedValue={selectedWalletId}
                        onValueChange={(itemValue) => setSelectedWalletId(itemValue)}
                    >
                        {wallets.map((wallet) => (
                            <Picker.Item key={wallet.id} label={wallet.name} value={wallet.id} />
                        ))}
                    </Picker>
                </Surface>

                {/* Address Input */}
                <Surface style={{ padding: 16, elevation: 2 }}>
                    <Text variant="headlineSmall">Enter the Wallet Address</Text>
                    <TextInput
                        mode="outlined"
                        value={receiverWalletAddress}
                        onChangeText={setReceiverWalletAddress}
                        placeholder="Receiver's Address"
                    />
                </Surface>

                {/* Amount Input */}
                <Surface style={{ padding: 16, elevation: 2 }}>
                    <Text variant="headlineSmall">Enter the Amount</Text>
                    <TextInput
                        mode="outlined"
                        value={value}
                        onChangeText={setValue}
                        keyboardType="numeric"
                        placeholder="0"
                    />
                    <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 16 }}>
                        Send
                    </Button>
                </Surface>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    );
}
