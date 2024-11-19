import React, {useState} from 'react';
import {StyleSheet, View, Text, ScrollView, Pressable, Dimensions} from 'react-native';
import {Link, useNavigation, useRouter} from "expo-router";
import {AntDesign, Feather, FontAwesome6, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {SafeAreaView} from "react-native-safe-area-context";
import Carousel from "react-native-snap-carousel";

interface TransactionHistory{
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
    { id: 1, cardId: 1, amount: 100, date: '2021-09-01', type: 'deposit' },
    { id: 2, cardId: 1, amount: 200, date: '2021-09-02', type: 'withdraw' },
    { id: 3, cardId: 2, amount: 300, date: '2021-09-03', type: 'deposit' },
    { id: 4, cardId: 3, amount: 400, date: '2021-09-04', type: 'withdraw' },
];

const mockCards: Cards[] = [
    { id: 1, name: 'Card 1', balance: 1000 },
    { id: 2, name: 'Card 2', balance: 2000 },
    { id: 3, name: 'Card 3', balance: 3000 },
    { id: -1, name: 'Add Wallet', balance: 0 }
];
let selectedWalletId= 0
export default function HomeScreen() {
    //All should be visible in the transaction history

    const userAccountData: UserAccount = {
        id: 1,
        name: 'John Doe',
        cards: mockCards,
    };

    const [selectedWalletId, setSelectedWalletId] = useState<number>(mockCards[0]?.id || 0);
    const navigation = useNavigation();
    const router = useRouter();

    return (
        //TODO: Keep the selected wallet id in the state and pass it to the wallet details page
        <SafeAreaView style={styles.container}>
            <Carousel
                data={userAccountData.cards}
                renderItem={({item}) => {
                    return (
                        item.id === -1 ?
                            <View style={
                                {
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                    padding: 20,
                                    height: 200,
                                    borderColor: "#555555",
                                    borderWidth: 3,
                                    justifyContent: "space-evenly",
                                }}>
                                {/* Center properly -->*/}
                                <Link href="../other/addWallet" asChild style={
                                    {
                                        marginLeft: 90
                                    }
                                }>
                                    <Pressable style={styles.circularButton}>
                                        <Feather name="plus" size={24} color="black"/>
                                    </Pressable>
                                </Link>
                            </View> :
                            <Pressable onPress={() => router.push({
                                pathname: '../other/walletDetails',
                                params: {selectedWalletId: item.id}
                            })}>
                                <View style={
                                    {
                                        backgroundColor: 'white',
                                        borderRadius: 10,
                                        padding: 20,
                                        marginLeft: 10,
                                        marginRight: 10,
                                        height: 200,
                                        borderColor: "#555555",
                                        borderWidth: 3,
                                    }}>
                                    <Text>{item.name}</Text>
                                    <Text>{item.balance}</Text>
                                </View>
                            </Pressable>
                    );
                }}
                sliderWidth={Dimensions.get("screen").width}
                itemWidth={Dimensions.get("screen").width * 0.8}
                vertical={false}
                onSnapToItem={(index) => {setSelectedWalletId(mockCards[index].id)}}
            />
            <View style={styles.walletAction}>
                <Link href="../other/atomicSwap" asChild>
                    <Pressable style={styles.circularButton}>
                        <MaterialIcons name="currency-exchange" size={24} color="black"/>
                    </Pressable>
                </Link>
                <Link href="../other/transaction" asChild>
                    <Pressable style={styles.circularButton}>
                        <FontAwesome6 name="money-bill-transfer" size={24} color="black"/>
                    </Pressable>
                </Link>
                <Link href={{
                    pathname: "../other/walletDetails",
                    params: {selectedWalletId}
                }} asChild>
                    <Pressable style={styles.circularButton}>
                        <MaterialCommunityIcons name="card-account-details" size={24} color="black"/>
                    </Pressable>
                </Link>
            </View>

            <View style={styles.detailsSection}>
                <Text style={styles.detailsText}>Transaction History</Text>
                <ScrollView>
                    {mockAll.map((transaction) => (
                        <View key={transaction.id} style={styles.tableRow}>
                            <Text>{transaction.cardId}</Text>
                            <Text>{transaction.amount}</Text>
                            <Text>{transaction.date}</Text>
                            <Text>{transaction.type}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "lightyellow",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 10,

    },

    walletContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    walletCard: {
        width: 200,
        height: 100,
        backgroundColor: "#ffffff",
        marginHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },

    walletAction: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "100%",
    },

    circularButton: {
        width: 75,
        height: 75,
        borderRadius: 70,
        borderColor: "black",
        borderWidth: 1,
        backgroundColor: 'lightgrey',
        justifyContent: 'space-around',
        padding: 23,
        margin: 20
    },

    detailsSection: {
        marginVertical: 20,
        backgroundColor: "white",
        height: 300,
        width: "100%",
        borderColor: "#555555",
        borderWidth: 3,
        justifyContent: "center",

    },

    detailsText: {
        fontSize: 24
    },

    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        justifyContent: 'space-between',
    }
});

