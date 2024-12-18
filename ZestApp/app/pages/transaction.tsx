import React, {useState, useEffect} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Picker} from "@react-native-picker/picker";
import {Button, Text, TextInput, useTheme, Surface} from "react-native-paper";
import {ScrollView} from "react-native";
import {Stack, useFocusEffect} from "expo-router";
import * as SecureStore from 'expo-secure-store';
import {Wallet} from "@/models/models";
import {fetchBalance} from "@/app/wallet-import";
import axios from "axios";
import bitcoin from 'bitcoinjs-lib';

export default function Transaction() {
    const theme = useTheme();
    const [selectedWalletId, setSelectedWalletId] = useState<string>("-1");
    const [selectedCurrency, setSelectedCurrency] = useState<string>("BTC");
    const [receiverWalletAddress, setReceiverWalletAddress] = useState<string>("");
    const [value, setValue] = useState<string>("");
    const [wallets, setWallets] = useState<Wallet[]>([]);

    const fetchWallets = async () => {
        const storedWallets = await SecureStore.getItemAsync('wallets');
        
        if (storedWallets) {
            const wallets = JSON.parse(storedWallets);
            for (let i = 0; i < wallets.length; i++) {
                let wallet = wallets[i];
                let balance = await fetchBalance(wallet.address);
                console.log(wallet.address, " " , balance);
            } 
            setWallets(wallets);
        } else {
            console.log("No wallets found.");
            setWallets([]);
        }
    };
    
    useEffect(() => {
        fetchWallets();
    }, []);

    const confirmSelection = () => {
        const selectedWalletIndex = selectedWalletId;
        //alert(`You selected: ${selectedWallet?.name}\nBalance: $${selectedWallet?.balance}`);
    };

    const handleChange = (input: string) => {
        setValue(input);
    };

    const walletAddressInput = (input: string) => {
        setReceiverWalletAddress(input);
    };
    
    const handleSubmit = async () => {
        const selectedWallet = wallets.find(wallet => wallet.id === selectedWalletId);
        if (!selectedWallet) {
          alert("Wallet not selected or doesn't exist.");
          return;
        }
    
        const { address, privateKey } = selectedWallet;
    
        // Fetch UTXOs for the selected wallet
        try {
          const utxoResponse = await axios.get(`https://blockstream.info/api/address/${address}/utxo`);
          const utxos = utxoResponse.data;
    
          if (utxos.length === 0) {
            alert("No UTXOs found for this wallet.");
            return;
          }
    
          // Prepare the inputs for the transaction
          const tx = new bitcoin.Transaction();
          let inputAmount = 0;
          for (let utxo of utxos) {
            tx.addInput(utxo.txid, utxo.vout);
            inputAmount += utxo.value;
          }
    
          // Calculate the amount to send (subtracting a small fee)
          const amountToSend = parseFloat(value) * 1e8; // Convert to satoshis
          const fee = 1000; // A small transaction fee in satoshis (can be adjusted)
          const change = inputAmount - amountToSend - fee;
    
          if (change < 0) {
            alert("Insufficient funds.");
            return;
          }
    
          const receiverScript = bitcoin.address.toOutputScript(receiverWalletAddress, bitcoin.networks.testnet);
          // Add the output (sending to the recipient address)
          tx.addOutput(receiverScript, amountToSend);
    
          const addressScript = bitcoin.address.toOutputScript(receiverWalletAddress, bitcoin.networks.testnet);
          // Add change output (sending back the remainder to the sender address)
          tx.addOutput(addressScript, change);
    
          // Sign the transaction with the private key
          const keyPair = ECPair.fromWIF(privateKey, bitcoin.networks.testnet);

          for (let i = 0; i < utxos.length; i++) {
            tx.sign(i, keyPair);
          }
    
          // Build the raw transaction
          const rawTx = tx.build().toHex();
          console.log("Raw Transaction: ", rawTx);
    
          // Broadcast the transaction
          try {
            const broadcastResponse = await axios.post('https://blockstream.info/api/tx', rawTx, {
              headers: { 'Content-Type': 'text/plain' }
            });
            alert(`Transaction sent! Txid: ${broadcastResponse.data}`);
          } catch (error) {
            console.error("Error broadcasting transaction: ", error);
            alert("Failed to broadcast transaction.");
          }
    
        } catch (error) {
          console.error("Error fetching UTXOs: ", error);
          alert("Failed to fetch UTXOs.");
        }
    };
    

    return (
        <ScrollView style={{backgroundColor: theme.colors.background}}>
            <Stack.Screen
                options={{
                    title: 'Transaction',
                    headerStyle: {backgroundColor: theme.colors.primaryContainer},
                    headerTintColor: theme.colors.onPrimary,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />
            <SafeAreaView style={{flex: 1, paddingHorizontal: 16, gap: 10}}>
                {/* Wallet Picker */}
                <Surface style={{padding: 16, elevation: 2}}>
                    <Text variant="headlineSmall">Choose Wallet</Text>
                    <Picker
                        selectedValue={selectedWalletId}
                        onValueChange={(itemValue) => setSelectedWalletId(itemValue)}
                    >
                        {wallets.map((wallet) => (
                            <Picker.Item key={wallet.id} label={wallet.name} value={wallet.id} />
                        ))}
                    </Picker>
                    <Text>Selected Wallet: {"Wallet " + selectedWalletId}</Text>
                </Surface>

                {/* Amount Input and Submit */}
                <Surface style={{padding: 16, elevation: 2}}>
                    <Text variant="headlineSmall">Enter the Wallet Address</Text>
                    <TextInput
                        mode="outlined"
                        value={receiverWalletAddress}
                        onChangeText={walletAddressInput}
                        keyboardType="default"
                        placeholder=""
                    />
                </Surface>

                {/* Amount Input and Submit */}
                <Surface style={{padding: 16, elevation: 2}}>
                    <Text variant="headlineSmall">Enter the Amount</Text>
                    <TextInput
                        mode="outlined"
                        value={value}
                        onChangeText={handleChange}
                        keyboardType="numeric"
                        placeholder="0"
                    />
                    <Button mode="contained" onPress={handleSubmit} style={{marginTop: 16}}>
                        Send
                    </Button>
                </Surface>

            </SafeAreaView>
        </ScrollView>
    );
}
