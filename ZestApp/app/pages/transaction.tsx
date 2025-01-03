import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { Button, Text, TextInput, useTheme, Surface } from "react-native-paper";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Wallet } from "@/models/models";
import { fetchBalance } from "@/app/wallet-import";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {makeTransaction} from "@/app/make-transaction";

export default function Transaction() {
    const theme = useTheme();
    const [selectedWalletId, setSelectedWalletId] = useState<string>("-1");
    const [receiverWalletAddress, setReceiverWalletAddress] = useState<string>("");
    const [value, setValue] = useState<string>("");
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [customData, setCustomData] = useState<string>("");
    const fetchWallets = async () => {
        const storedWallets = await SecureStore.getItemAsync("wallets");

        if (storedWallets) {
            const wallets:Wallet[] = JSON.parse(storedWallets);
            console.log("Wallets found:", wallets);
            for (let wallet of wallets) {
                const balance = await fetchBalance(wallet.address,wallet.network);
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
        await makeTransaction(selectedWallet, value, receiverWalletAddress, customData);
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
                {/* Return Data */}
                <Surface style={{ padding: 16, elevation: 2 }}>
                    <Text variant="headlineSmall">Data</Text>
                    <TextInput
                        mode="outlined"
                        value={customData}
                        onChangeText={setCustomData}
                        placeholder="(optional)"
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
