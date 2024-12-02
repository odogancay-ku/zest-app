import React, {useState} from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import {Link, useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {Card, Text, IconButton, Divider, useTheme} from 'react-native-paper';
import Carousel from "react-native-snap-carousel";
import {FontAwesome6, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import CircleButton from "@/app/widgets/CircleButton";
import {white} from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import {Colors} from "@/constants/Colors";

interface TransactionHistory {
    id: number;
    walletId: number;
    amount: number;
    date: string;
    type: string;
}

interface Cards {
    id: number;
    name: string;
    balance: number;
}

const mockAll: TransactionHistory[] = [
    {id: 1, walletId: 1, amount: 100, date: '2021-09-01', type: 'deposit'},
    {id: 2, walletId: 1, amount: 200, date: '2021-09-02', type: 'withdraw'},
    {id: 3, walletId: 2, amount: 300, date: '2021-09-03', type: 'deposit'},
    {id: 4, walletId: 3, amount: 400, date: '2021-09-04', type: 'withdraw'},
];

const mockCards: Cards[] = [
    {id: 1, name: 'Wallet 1', balance: 1000},
    {id: 2, name: 'Wallet 2', balance: 2000},
    {id: 3, name: 'Wallet 3', balance: 3000},
    {id: -1, name: 'Add Wallet', balance: 0}
];

export default function HomeScreen() {
    const [selectedWalletId, setSelectedWalletId] = useState<number>(mockCards[0]?.id || 0);
    const router = useRouter();

    // Filter transactions based on the selected wallet
    const filteredTransactions = mockAll.filter(transaction => transaction.walletId === selectedWalletId);

    const theme = useTheme();

    return (
        <SafeAreaView style={{flexDirection: "column", gap: 10, padding: 10, backgroundColor: theme.colors.background}}>
            <Carousel
                data={mockCards}
                renderItem={({item}) => (
                    item.id === -1 ? (
                        <Card
                            style={{height: 200}}
                            onPress={() => router.push('/pages/addWallet')}
                        >
                            <Card.Content style={{alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <IconButton
                                    icon="plus"
                                    size={40}
                                />
                            </Card.Content>
                        </Card>
                    ) : (
                        <Card style={{height: 200}}>
                            <Card.Content style={{height: '100%'}}>
                                <Text variant="headlineSmall">{item.name}</Text>
                                <Text>{item.balance}</Text>
                            </Card.Content>
                        </Card>
                    )
                )}
                sliderWidth={Dimensions.get("screen").width}
                itemWidth={Dimensions.get("screen").width * 0.8}
                vertical={false}
                onSnapToItem={(index) => setSelectedWalletId(mockCards[index].id)}
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
                <Link href={{pathname: "/pages/walletDetails", params: {selectedWalletId}}} asChild>
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
                        <View key={transaction.id} style={{
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
