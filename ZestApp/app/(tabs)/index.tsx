import React from 'react';
import {StyleSheet, View, Text, ScrollView, Pressable, Dimensions} from 'react-native';
import {Link, useNavigation} from "expo-router";
import {FontAwesome6, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {SafeAreaView} from "react-native-safe-area-context";
import Carousel from "react-native-snap-carousel";

interface TransactionHistory{
    id: number;
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

const mockHistory: TransactionHistory[] = []
const mockAll: TransactionHistory[] = []
let selectedWalletId= 0
export default function HomeScreen() {

    let hist1= {id: 1, amount: 100, date: "2021-09-01", type: "deposit"};
    let hist2= {id: 2, amount: 200, date: "2021-09-02", type: "withdraw"};
    let hist3= {id: 3, amount: 300, date: "2021-09-03", type: "deposit"};
    let hist4= {id: 4, amount: 400, date: "2021-09-04", type: "withdraw"};
    mockHistory.push(hist1);
    mockHistory.push(hist2);

    mockAll.push(hist1);
    mockAll.push(hist2);
    mockAll.push(hist3);
    mockAll.push(hist4);

    //All should be visible in the transaction history
    let card_list: Cards[] = []
    const card_1 = {id: 1, name: 'Card 1', balance: 1000};
    const card_2 = {id: 2, name: 'Card 2', balance: 2000};
    const card_3 = {id: 3, name: 'Card 3', balance: 3000};
    card_list.push(card_1)
    card_list.push(card_2)
    card_list.push(card_3)

    const userAccountData: UserAccount = {
        id: 1,
        name: 'John Doe',
        cards: card_list,
    };

    const navigation = useNavigation();
    return (
        //TODO: Keep the selected wallet id in the state and pass it to the wallet details page
        <SafeAreaView style={styles.container}>
            <Carousel
                data={userAccountData.cards}
                renderItem={({item, index}) => {
                    return (
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
                    );
                }}
                sliderWidth={Dimensions.get("screen").width}
                itemWidth={Dimensions.get("screen").width * 0.8}
                vertical={false}
            />
            <View style={styles.walletAction}>
                <Link href="../other/atomicSwap" asChild>
                    <Pressable style={styles.circularButton}>
                        <MaterialIcons name="currency-exchange" size={24} color="black" />
                    </Pressable>
                </Link>
                <Link href="../other/transaction" asChild>
                    <Pressable style={styles.circularButton}>
                        <FontAwesome6 name="money-bill-transfer" size={24} color="black"/>
                    </Pressable>
                </Link>
                <Link href={{
                    pathname:"../other/walletDetails",
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
                    {mockHistory.map((transaction) => (
                        <View key={transaction.id} style={styles.tableRow}>
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

