import React, {useEffect, useState} from 'react';
import {
    Dimensions,
    ScrollView,
    TouchableOpacity,
    View,
    ToastAndroid,
    RefreshControl,
    ActivityIndicator,
    Clipboard,
    Modal,
    StyleSheet,
    Pressable,
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {Card, Text, IconButton, Divider, useTheme} from 'react-native-paper';
import Carousel from "react-native-snap-carousel";
import {Link, useRouter} from "expo-router";
import CircleButton from "@/app/widgets/CircleButton";
import * as SecureStore from 'expo-secure-store';
import {WalletDisplay} from "@/models/models";
import {WalletNetwork} from "@/constants/Enums";
import {FontAwesome6, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import createStyles from "@/app/styles/styles";
import TransactionDetailModal from "@/app/widgets/TransactionDetailModal";
import TransactionHistoryTable from "@/app/widgets/TransactionHistoryTable";

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

export default function HomeScreen() {
    const [wallets, setWallets] = useState<WalletDisplay[]>([]);
    const [selectedWalletIndex, setSelectedWalletIndex] = useState<number>(0);
    const [transactions, setTransactions] = useState<Record<string, any[]>>({});
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const theme = useTheme();
    const router = useRouter();
    const styles = createStyles(theme);

    const copyToClipboard = (text: string) => {
        Clipboard.setString(text);
        ToastAndroid.show('Address copied to clipboard!', ToastAndroid.SHORT);
    };

    const fetchWallets = async () => {
        const storedWallets = await SecureStore.getItemAsync('wallets');
        if (!storedWallets) {
            setWallets([]);
            router.push('/pages/addWallet');
            return;
        }
        const parsedWallets = JSON.parse(storedWallets);
        setWallets(parsedWallets);
    };

    const loadTransactions = async (wallet: WalletDisplay) => {
        if (isFetching) return; // Prevent multiple fetches
        setIsFetching(true);

        const newTransactions = await fetchTransactions(wallet.address);
        setTransactions((prev) => ({
            ...prev,
            [wallet.id]: newTransactions
        }));

        setIsFetching(false);
    };

    const onRefresh = async () => {
        const currentWallet = wallets[selectedWalletIndex];
        if (currentWallet) await loadTransactions(currentWallet);
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    useEffect(() => {
        const currentWallet = wallets[selectedWalletIndex];
        if (currentWallet && !transactions[currentWallet.id]) {
            loadTransactions(currentWallet);
        }
    }, [selectedWalletIndex, wallets]);

    const currentWallet = wallets[selectedWalletIndex];
    const currentTransactions = currentWallet ? transactions[currentWallet.id] || [] : [];

    const calculateNetBalance = (tx: any, address: string) => {
        const incoming = tx.vout
            .filter((output: any) => output.scriptpubkey_address === address)
            .reduce((sum: number, output: any) => sum + output.value, 0);

        const outgoing = tx.vin
            .filter((input: any) => input.prevout?.scriptpubkey_address === address)
            .reduce((sum: number, input: any) => sum + input.prevout.value, 0);

        return incoming - outgoing; // Positive for incoming, negative for outgoing
    };

    const handleTransactionClick = (transaction: any) => {
        if (!transaction) {
            console.error("Invalid transaction");
            return;
        }
        setSelectedTransaction(transaction);
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={{flexDirection: "column", gap: 10, padding: 10, backgroundColor: theme.colors.background}}>
            <Carousel
                data={[...wallets, {
                    id: "",
                    name: "Add Wallet",
                    balance: 0,
                    network: WalletNetwork.Bitcoin,
                    address: ""
                }]}
                renderItem={({item, index}) => (
                    item.id === "" ? (
                        <Card
                            style={{height: 200, backgroundColor: theme.colors.primaryContainer}}
                            onPress={() => router.push('/pages/addWallet')}
                        >
                            <Card.Content style={{alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <IconButton
                                    icon="plus"
                                    size={40}
                                    style={{borderWidth: 1, backgroundColor: theme.colors.onPrimary}}
                                />
                            </Card.Content>
                        </Card>
                    ) : (
                        <TouchableOpacity
                            onPress={() => router.push({
                                pathname: '/pages/walletDetails',
                                params: {selectedWalletId: item.id}
                            })}
                        >
                            <Card style={{
                                height: 200,
                                backgroundColor: theme.colors.primaryContainer,
                                paddingVertical: 10
                            }}>
                                <Card.Content style={{height: '100%', justifyContent: 'space-between'}}>
                                    <Text variant="headlineSmall" style={{fontSize: 20}}>{item.name}</Text>
                                    <Text style={{fontSize: 14}}>Balance: {item.balance}</Text>
                                    <Text style={{fontSize: 14}}>Network: {item.network}</Text>
                                    <Text
                                        style={{fontSize: 12}}
                                        onPress={() => copyToClipboard(item.address)}
                                    >
                                        Address: {item.address} 📋
                                    </Text>
                                </Card.Content>
                            </Card>
                        </TouchableOpacity>
                    )
                )}
                sliderWidth={Dimensions.get("screen").width}
                itemWidth={Dimensions.get("screen").width * 0.8}
                vertical={false}
                onScrollIndexChanged={(index) => {
                    setSelectedWalletIndex(index);
                }}
            />

            <ScrollView horizontal={true} style={{height: 100, width: '100%'}}
                        contentContainerStyle={{
                            flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                            gap: 30,
                            padding: 10
                        }}
                        showsHorizontalScrollIndicator={false}>
                <Link href={{pathname: "/pages/atomicSwap"}} asChild>
                    <CircleButton>
                        <MaterialIcons name="currency-exchange" size={30} color="black"/>
                    </CircleButton>
                </Link>
                <Link href={{pathname: "/pages/transaction"}} asChild>
                    <CircleButton>
                        <FontAwesome6 name="money-bill-transfer" size={30} color="black"/>
                    </CircleButton>
                </Link>
                <Link href={{pathname: "/pages/walletDetails", params: {selectedWalletIndex}}} asChild>
                    <CircleButton>
                        <MaterialCommunityIcons name="card-account-details" size={30} color="black"/>
                    </CircleButton>
                </Link>
            </ScrollView>

            <TransactionHistoryTable isFetching={isFetching} onRefresh={onRefresh} currentTransactions={currentTransactions} handleTransactionClick={handleTransactionClick} currentWallet={currentWallet} modalVisible={modalVisible} setModalVisible={setModalVisible} selectedTransaction={selectedTransaction} />


        </SafeAreaView>
    );
}

