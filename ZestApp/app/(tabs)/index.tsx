import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, TouchableOpacity, View} from 'react-native';
import {Link, useFocusEffect, useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {Card, Text, IconButton, Divider, useTheme} from 'react-native-paper';
import Carousel from "react-native-snap-carousel";
import {FontAwesome6, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import CircleButton from "@/app/widgets/CircleButton";
import * as SecureStore from 'expo-secure-store';
import {WalletDisplay} from "@/models/models";
import {fetchBalance} from "@/app/wallet-import";

//TODO: remove the mock data
interface TransactionHistory {
    walletId: string;
    amount: number;
    date: string;
    type: string;
}

const mockAll: TransactionHistory[] = [
    {walletId: "1", amount: 100, date: '2021-09-01', type: 'deposit'},
    {walletId: "1", amount: 200, date: '2021-09-02', type: 'withdraw'},
    {walletId: "2", amount: 300, date: '2021-09-03', type: 'deposit'},
    {walletId: "3", amount: 400, date: '2021-09-04', type: 'withdraw'},
];

export default function HomeScreen() {
    const [wallets, setWallets] = useState<WalletDisplay[]>([]);
    const [selectedWalletIndex, setSelectedWalletIndex] = useState<number>(0);
    const router = useRouter();
    const theme = useTheme();

    useFocusEffect( React.useCallback(() => {
        const fetchWallets = async () => {
            const storedWallets = await SecureStore.getItemAsync('wallets');
            console.log(storedWallets);
            if (!storedWallets) {
                setWallets([]); //to make it more consistent
                router.push('/pages/addWallet');
                return;
            }
            const parsedWallets = JSON.parse(storedWallets);

            const updatedWallets = await Promise.all(
                parsedWallets.map(async (wallet: { address: string; }) => {
                    const balance = await fetchBalance(wallet.address);
                    return {...wallet, balance};
                })
            );

            setWallets(updatedWallets);
        };
        fetchWallets();
    }, []));


    const filteredTransactions = mockAll.filter(transaction => transaction.walletId === wallets[selectedWalletIndex]?.id);

    return (
        <SafeAreaView style={{flexDirection: "column", gap: 10, padding: 10, backgroundColor: theme.colors.background}}>
            <Carousel
                data={[...wallets, {id: "", name: "Add Wallet", balance: 0}]}
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
                                height: 200, backgroundColor: theme.colors.primaryContainer
                            }}>
                                <Card.Content style={{height: '100%'}}>
                                    <Text variant="headlineSmall">{item.name}</Text>
                                    <Text>{item.balance}</Text>
                                    <Text>{item.network}</Text>
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

            <Card style={{padding: 10}}>
                <Card.Title title="Transaction History"/>
                <Divider/>
                <ScrollView>
                    {filteredTransactions.map((transaction) => (
                        <View key={transaction.date} style={{
                            flexDirection: 'row',
                            paddingVertical: 10,
                            paddingHorizontal: 5,
                            borderBottomWidth: 1,
                            borderColor: '#eee'
                        }}>
                            <Text style={{flex: 1}}>{transaction.walletId}</Text>
                            <Text style={{flex: 1}}>{transaction.amount}</Text>
                            <Text style={{flex: 1}}>{transaction.date}</Text>
                            <Text style={{flex: 1}}>{transaction.type}</Text>
                        </View>
                    ))}
                </ScrollView>
            </Card>
        </SafeAreaView>
    );
}
