import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Text, TextInput, Button, useTheme, Surface} from "react-native-paper";
import {ScrollView} from "react-native";
import {Stack, useLocalSearchParams} from "expo-router";
import {createSwap, initVerification, refund} from "@/app/atomicSwap";
import * as SecureStore from "expo-secure-store";
import {Wallet} from "@/models/models";
import {fetchBalance} from "@/app/wallet-import";
import LoadingOverlay from "@/app/widgets/LoadingOverlay";

export default function AtomicSwapUI() {

    const {selectedWalletIndex = 0} = useLocalSearchParams();
    const [evmWallet, setEvmWallet] = useState<Wallet | null>(null);
    const [loading, setLoading] = useState(true);

    const theme = useTheme();


    const fetchWallet = async () => {
        setLoading(true); // Start loading
        try {
            const storedWallets = await SecureStore.getItemAsync("wallets");

            if (storedWallets) {
                const wallets: Wallet[] = JSON.parse(storedWallets);
                setEvmWallet(wallets[+selectedWalletIndex]);
                console.log("Selected wallet:", wallets[+selectedWalletIndex]);
            } else {
                console.log("No wallets found.");
            }
        } catch (error) {
            console.error("Error fetching wallets:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);




    // State for creating a swap
    const [evmAmountToBeSent, setEvmAmountToBeSent] = useState<number>(0);
    const [evmAmountToBeReceived, setEvmAmountToBeReceived] = useState<number>(0);
    const [swapRecipient, setSwapRecipient] = useState<string>();

    // State for initializing verification
    const [transactionId, setTransactionId] = useState<string>();
    const [swapIdVerification, setSwapIdVerification] = useState<number>(0);

    // State for refund
    const [swapIdRefund, setSwapIdRefund] = useState<number>(0);


    if (!evmWallet) {
        return (
            <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text>No wallet found. Please add a wallet first.</Text>
            </SafeAreaView>
        );
    }

    const handleCreateSwap = async () => {
        if (!evmAmountToBeReceived || !evmAmountToBeSent || !swapRecipient) {
            alert("Please fill in all fields for creating a swap.");
            return;
        }

        try {
            const swapId = await createSwap(evmWallet.privateKey, evmAmountToBeReceived, evmAmountToBeSent, swapRecipient);
            alert(`Swap created successfully! Swap ID: ${swapId}`);
        } catch (error) {
            console.error("Error creating swap:", error);
            alert("Failed to create swap. Please try again.");
        }
    };

    const handleInitVerification = async () => {
        if (!transactionId || !swapIdVerification) {
            alert("Please provide both Transaction ID and Swap ID for verification.");
            return;
        }

        try {
            await initVerification(evmWallet.privateKey, transactionId, swapIdVerification);
            alert("Verification is started.");
        } catch (error) {
            console.error("Error initializing verification:", error);
            alert("Failed to start verification. Please try again.");
        }
    };

    const handleRefund = async () => {
        if (!swapIdRefund) {
            alert("Please provide a Swap ID for refund.");
            return;
        }

        try {
            await refund(swapIdRefund);
            alert("Refund requested. This may take a couple of minutes.");
        } catch (error) {
            console.error("Error requesting refund:", error);
            alert("Failed to request refund. Please try again.");
        }
    };

    return (
        <ScrollView style={{backgroundColor: theme.colors.background}}>
            <Stack.Screen
                options={{
                    title: "Atomic Swap",
                    headerStyle: {backgroundColor: theme.colors.primaryContainer},
                    headerTintColor: theme.colors.onPrimary,
                    headerTitleStyle: {fontWeight: "bold"},
                }}
            />
            {loading && <LoadingOverlay message="Fetching wallet details..."/>}

            {!loading &&  <SafeAreaView style={{flex: 1, padding: 16, gap: 20}}>
                {/* Create Swap */}
                <Surface style={{padding: 16, elevation: 2, gap: 10}}>
                    <Text variant="headlineSmall">Create Swap</Text>
                    <Text>From wallet: {evmWallet.address}</Text>
                    <TextInput
                        mode="outlined"
                        label="Amount to Send (EVM)"
                        value={evmAmountToBeSent.toString()}
                        onChangeText={(text) =>
                            /^\d*\.?\d*$/.test(text) && setEvmAmountToBeSent(parseFloat(text))
                        }
                        keyboardType="numeric"
                        placeholder="Enter Amount"
                    />
                    <TextInput
                        mode="outlined"
                        label="Amount to Receive (BTC)"
                        value={evmAmountToBeReceived.toString()}
                        onChangeText={(text) =>
                            /^\d*\.?\d*$/.test(text) && setEvmAmountToBeReceived(parseFloat(text))
                        }
                        keyboardType="numeric"
                        placeholder="Enter Amount"
                    />
                    <TextInput
                        mode="outlined"
                        label="Recipient Wallet (BTC)"
                        value={swapRecipient}
                        onChangeText={setSwapRecipient}
                        placeholder="Enter BTC Wallet Address"
                    />
                    <Button mode="contained" onPress={handleCreateSwap} style={{marginTop: 16}}>
                        Create Swap
                    </Button>
                </Surface>

                {/* Initialize Verification */}
                <Surface style={{padding: 16, elevation: 2, gap: 10}}>
                    <Text variant="headlineSmall">Initialize Verification</Text>
                    <TextInput
                        mode="outlined"
                        label="Transaction ID"
                        value={transactionId}
                        onChangeText={setTransactionId}
                        placeholder="Enter Transaction ID"
                    />
                    <TextInput
                        mode="outlined"
                        label="Swap ID"
                        value={swapIdVerification.toString()}
                        onChangeText={(text) =>
                            /^\d*$/.test(text) && setSwapIdVerification(parseInt(text, 10))
                        }
                        keyboardType="numeric"
                        placeholder="Enter Swap ID"
                    />
                    <Button mode="contained" onPress={handleInitVerification} style={{marginTop: 16}}>
                        Start Verification
                    </Button>
                </Surface>

                {/* Refund */}
                <Surface style={{padding: 16, elevation: 2, gap: 10}}>
                    <Text variant="headlineSmall">Request Refund</Text>
                    <TextInput
                        mode="outlined"
                        label="Swap ID"
                        value={swapIdRefund.toString()}
                        onChangeText={(text) =>
                            /^\d*$/.test(text) && setSwapIdRefund(parseInt(text, 10))
                        }
                        keyboardType="numeric"
                        placeholder="Enter Swap ID"
                    />
                    <Button mode="contained" onPress={handleRefund} style={{marginTop: 16}}>
                        Request Refund
                    </Button>
                </Surface>
            </SafeAreaView>}

        </ScrollView>
    );
}
