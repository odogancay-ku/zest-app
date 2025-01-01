import React from 'react';
import {
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    View,
} from 'react-native';
import {Card, Text, Divider, useTheme} from 'react-native-paper';
import TransactionDetailModal from './TransactionDetailModal'; // Adjust import based on file structure

interface TransactionHistoryTableProps {
    isFetching: boolean;
    onRefresh: () => void;
    currentTransactions: any[];
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

    const calculateNetBalance = (tx: any, address: string) => {
        const incoming = tx.vout
            .filter((output: any) => output.scriptpubkey_address === address)
            .reduce((sum: number, output: any) => sum + output.value, 0);

        const outgoing = tx.vin
            .filter((input: any) => input.prevout?.scriptpubkey_address === address)
            .reduce((sum: number, input: any) => sum + input.prevout.value, 0);

        return incoming - outgoing; // Positive for incoming, negative for outgoing
    };

    return (
        <Card style={{padding: 10}}>
            <Card.Title title="Transaction History"/>
            <Divider/>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={onRefresh}/>
                }
            >
                {currentTransactions.length > 0 ? (
                    currentTransactions.map((tx) => (
                        <TouchableOpacity key={tx.txid} onPress={() => handleTransactionClick(tx)}>
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
                                    {new Date(tx.status.block_time * 1000).toLocaleDateString()}
                                </Text>
                                <Text style={{flex: 1, fontSize: 16}}>
                                    {tx.status.confirmed ? 'Confirmed' : 'Pending'}
                                </Text>
                                <Text style={{flex: 1, fontSize: 16}}>
                                    {calculateNetBalance(tx, currentWallet.address) > 0 ? '+' : ''}
                                    {calculateNetBalance(tx, currentWallet.address)}
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
                calculateNetBalance={calculateNetBalance}
            />
        </Card>
    );

}

export default TransactionHistoryTable;
