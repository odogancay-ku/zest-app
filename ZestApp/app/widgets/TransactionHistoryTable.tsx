import React from 'react';
import {
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    View,
} from 'react-native';
import {Card, Text, Divider, useTheme} from 'react-native-paper';
import TransactionDetailModal from './TransactionDetailModal';
import {TransactionHistory} from "@/models/models"; // Adjust import based on file structure

interface TransactionHistoryTableProps {
    isFetching: boolean;
    onRefresh: () => void;
    currentTransactions: TransactionHistory[];
    handleTransactionClick: (tx: any) => void;
    currentWallet: any;
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    selectedTransaction: any;
}

const TransactionHistoryTable = ({
                                     isFetching,
                                     onRefresh,
                                     currentTransactions,
                                     handleTransactionClick,
                                     currentWallet,
                                     modalVisible,
                                     setModalVisible,
                                     selectedTransaction,
                                 }: TransactionHistoryTableProps) => {


    const theme = useTheme();

    return (
        <Card style={{padding: 10}}>
            <Card.Title title="Transaction History"/>
            <Divider/>

            <View
                style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                    borderBottomWidth: 1,
                    borderColor: theme.colors.outline,
                }}
            >
                <Text style={{flex: 1, fontSize: 16, fontWeight: 'bold'}}>Date</Text>
                <Text style={{flex: 1, fontSize: 16, fontWeight: 'bold'}}>Status</Text>
                <Text style={{flex: 1, fontSize: 16, fontWeight: 'bold'}}>Amount</Text>
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={onRefresh}/>
                }
            >
                {currentTransactions.length > 0 ? (
                    currentTransactions.map((tx) => (
                        <TouchableOpacity key={tx.id} onPress={() => handleTransactionClick(tx)}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    paddingVertical: 10,
                                    paddingHorizontal: 5,
                                    borderBottomWidth: 1,
                                    borderColor: theme.colors.outline,
                                }}
                            >
                                <Text style={{flex: 1, fontSize: 16}}>
                                    {new Date(tx.date).toLocaleDateString()}
                                </Text>
                                <Text style={{flex: 1, fontSize: 16}}>
                                    {tx.status}
                                </Text>
                                <Text style={{flex: 1, fontSize: 16}}>
                                    {tx.amount}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : isFetching ? (
                    <ActivityIndicator size="large" color={theme.colors.primary}/>
                ) : (
                    <Text style={{textAlign: 'center', marginVertical: 20}}>No Transactions Found</Text>
                )}
            </ScrollView>
            <TransactionDetailModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                transaction={selectedTransaction}
                walletAddress={currentWallet?.address || ''}
            />
        </Card>
    );

}

export default TransactionHistoryTable;
