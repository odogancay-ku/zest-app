import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { Button, Text, TextInput, useTheme, Surface } from "react-native-paper";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Wallet } from "@/models/models";
import { fetchBalance } from "@/app/wallet-import";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {makeTransaction} from "@/app/make-transaction";
import { View, StyleSheet, TouchableOpacity, Pressable, Modal} from "react-native";
import {Camera, BarcodeScanningResult, CameraView, useCameraPermissions} from "expo-camera";


export default function Transaction() {
    const theme = useTheme();
    const [selectedWalletId, setSelectedWalletId] = useState<string>("-1");
    const [receiverWalletAddress, setReceiverWalletAddress] = useState<string>("");
    const [value, setValue] = useState<string>("");
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [qrModalVisible, setQrModalVisible] = useState(false); 

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState<boolean>(false);
    const [permission, requestPermission] = useCameraPermissions();

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

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    if (hasPermission === null) {
        return <Text>Requesting camera permission...</Text>;
    }
    if (!hasPermission) {
        return <Text>No access to camera</Text>;
    }

    const showQRCode = () => {
        setQrModalVisible(true);
    };

    const closeQRCode = () => {
        setQrModalVisible(false);
    };

    return (
        <KeyboardAwareScrollView style={{ backgroundColor: theme.colors.background }}>
            { /* Scanning */}
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
                            backgroundColor: "#2a2a2a",
                            padding: 50,
                            borderRadius: 10,
                            alignItems: "center",
                            elevation: 5,
                        }}>
                        <Text style={{
                            color: "white",
                            fontSize: 40,
                        }}>QR Code Scanner</Text>
                        <View style={{ gap: 20 }}>
                            <Pressable onPress={requestPermission}>
                                <Text style={{
                                        color: "#0E7AFE",
                                        fontSize: 20,
                                        textAlign: "center",
                                    }
                                }>Request Permissions</Text>
                            </Pressable>
                            <CameraView
                                style={{ width: 300, height: 300 }}
                                onBarcodeScanned={(scanningResult: BarcodeScanningResult) => {
                                    if (!scanned) {
                                        closeQRCode();
                                        setReceiverWalletAddress(scanningResult.data);
                                    }
                                }}
                            />
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

                <View style={{marginTop: 10}}>
                    <Button mode="contained" color={theme.colors.error} onPress={showQRCode}>
                        Scan QR
                    </Button>
                </View>
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
