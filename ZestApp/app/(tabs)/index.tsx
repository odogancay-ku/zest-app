import React, {useState} from 'react';
import {Dimensions, Pressable, ScrollView, TouchableOpacity, View} from 'react-native';
import {Link, useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {Card, Button, Text, IconButton, Divider, useTheme} from 'react-native-paper';
import Carousel from "react-native-snap-carousel";
import {FontAwesome6, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import CircleButton from "@/app/widgets/CircleButton";

interface TransactionHistory {
    id: number;
    cardId: number;
    amount: number;
    date: string;
    type: string;
}

interface Cards {
    id: number;
    name: string;
    balance: number;
}

interface UserAccount {
    id: number;
    name: string;
    cards: Cards[];
}

const mockAll: TransactionHistory[] = [
    {id: 1, cardId: 1, amount: 100, date: '2021-09-01', type: 'deposit'},
    {id: 2, cardId: 1, amount: 200, date: '2021-09-02', type: 'withdraw'},
    {id: 3, cardId: 2, amount: 300, date: '2021-09-03', type: 'deposit'},
    {id: 4, cardId: 3, amount: 400, date: '2021-09-04', type: 'withdraw'},
];

const mockCards: Cards[] = [
    {id: 1, name: 'Card 1', balance: 1000},
    {id: 2, name: 'Card 2', balance: 2000},
    {id: 3, name: 'Card 3', balance: 3000},
    {id: -1, name: 'Add Wallet', balance: 0}
];

export default function HomeScreen() {
    const [selectedWalletId, setSelectedWalletId] = useState<number>(mockCards[0]?.id || 0);
    const router = useRouter();

    return (
        <SafeAreaView style={{flex: 1, padding: 10, backgroundColor: useTheme().colors.background}}>
            <Carousel
                data={mockCards}
                renderItem={({item}) => {
                    return (
                        item.id === -1 ? (
                            <Card style={{height: 200}}
                                  onPress={() => router.push('../other/addWallet')}
                            >
                                <Card.Content style={{alignItems: 'center', justifyContent: 'center', height: '100%'}}
                                >
                                    <IconButton
                                        icon="plus"
                                        size={40}
                                    />
                                </Card.Content>
                            </Card>
                        ) : (
                            <Card
                                style={{height: 200}}
                                onPress={() =>
                                    router.push({
                                        pathname: '/other/walletDetails',
                                        params: {selectedWalletId: item.id}
                                    })
                                }
                            >
                                <Card.Content style={{height: '100%'}}>
                                    <Text variant="headlineSmall">{item.name}</Text>
                                    <Text>{item.balance}</Text>
                                </Card.Content>
                            </Card>
                        )
                    );
                }}
                sliderWidth={Dimensions.get("screen").width}
                itemWidth={Dimensions.get("screen").width * 0.8}
                vertical={false}
                onSnapToItem={(index) => setSelectedWalletId(mockCards[index].id)}
            />

            <ScrollView horizontal={true} style={{height: 0, width: '100%'}}
                        contentContainerStyle={{
                            flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                            gap: 30,
                            padding: 10
                        }}
                        showsHorizontalScrollIndicator={false}>

                <Link href={{pathname: "/other/atomicSwap"}} asChild>
                    <CircleButton>
                        <MaterialIcons name="currency-exchange" size={30} color="black"/>
                    </CircleButton>
                </Link>
                <Link href={{pathname: "/other/transaction"}} asChild>
                    <CircleButton>
                        <FontAwesome6 name="money-bill-transfer" size={30} color="black"/>
                    </CircleButton>
                </Link>
                <Link href={{pathname: "/other/walletDetails", params: {selectedWalletId}}} asChild>
                    <CircleButton>
                        <MaterialCommunityIcons name="card-account-details" size={30} color="black"/>
                    </CircleButton>
                </Link>
            </ScrollView>

            <Card style={{marginTop: 20, padding: 10}}>
                <Card.Title title="Transaction History"/>
                <Divider/>
                <ScrollView>
                    {mockAll.map((transaction) => (
                        <View key={transaction.id} style={{
                            flexDirection: 'row',
                            paddingVertical: 10,
                            paddingHorizontal: 5,
                            borderBottomWidth: 1,
                            borderColor: '#eee'
                        }}>
                            <Text style={{flex: 1}}>{transaction.cardId}</Text>
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
