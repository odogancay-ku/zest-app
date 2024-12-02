import { View, StyleSheet, Text, Pressable, Dimensions, Alert, SafeAreaView, Button, TextInput } from "react-native";
import React, { useState } from "react";
import Carousel from "react-native-snap-carousel";
import { Picker } from "@react-native-picker/picker";


interface Wallet {
    id: number;
    name: string;
    balance: number;
}

const mockCards: Wallet[] = [
    { id: 1, name: 'Wallet 1', balance: 1000 },
    { id: 2, name: 'Wallet 2', balance: 2000 },
    { id: 3, name: 'Wallet 3', balance: 3000 },
];

export default function AtomicSwap() {
    
    const [selectedWalletId, setSelectedWalletId] = useState<number>(mockCards[0]?.id || 0);
    const [selectedCurrency, setSelectedCurrency] = useState<string>("BTC");

    const confirmSelection = () => {
        const selectedWallet = mockCards.find(wallet => wallet.id === selectedWalletId);
        Alert.alert(
            "Wallet Selected",
            `You selected: ${selectedWallet?.name}\nBalance: $${selectedWallet?.balance}`,
            [{ text: "OK" }]
        );
    };

    const [value, setValue] = useState<string>('');  // Using string type for value

    const handleChange = (input: string) => {
        // Ensure that only numeric input is allowed
        if (/^\d*$/.test(input)) {
            setValue(input);  // Only update state if the input is a number
        }
    };

    const handleSubmit = () => {
        // Handle the value when the input is submitted
        alert(`You entered: ${value}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Choose Wallet</Text>
            <Picker
            selectedValue={selectedWalletId}
            onValueChange={(itemValue) => setSelectedWalletId(itemValue)}
            style={styles.picker}
            >
                {mockCards.map((card) => (
                <Picker.Item key={card.id} label={card.name} value={card.id} />
            ))}
            </Picker>

            <Text style={styles.selectedText}>
                Selected Wallet: {"Wallet " + selectedWalletId}
            </Text>

            <Text style={styles.title}>Choose Currency</Text>
            <Picker
                selectedValue={selectedCurrency}
                onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="BTC - Bitcoin" value="BTC" />
                <Picker.Item label="ETH - Ethereum" value="ETH" />
            </Picker>
            
            <Text style={styles.selectedText}>
                Selected Currency: {selectedCurrency}
            </Text>

        <View style={styles.container}>
            <Text style={styles.title}>Enter the amount:</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={handleChange}  // Handle the input change
                keyboardType="numeric"  // Show numeric keyboard
                placeholder="0"  // Placeholder text
            />
                
            <Button  title="Swap" onPress={handleSubmit} />

        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    walletCard: {
        height: 100,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#ddd",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    walletName: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 10,
    },
    walletBalance: {
        fontSize: 16,
        color: "#555",
    },
    confirmButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    confirmButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    picker: {
        width: "80%",
        height: 50,
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 10,
    },
    selectedText: {
        marginTop: 20,
        fontSize: 16,
        color: "#555",
    },
    input: {
        width: 250,
        height: 40,
        alignItems: "center",
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 18,
    },
});
