import React, {useEffect} from 'react';
import {Modal, View, Pressable, Text, Clipboard, ToastAndroid, Alert} from 'react-native';
import {Divider, useTheme} from 'react-native-paper';
import createStyles from '@/app/styles/styles';

interface TransactionDetailModalProps {
    visible: boolean;
    onClose: () => void;
    transaction: any;
    walletAddress: string;
    calculateNetBalance: (tx: any, address: string) => number;
}

export default function TransactionDetailModal({
                                                   visible,
                                                   onClose,
                                                   transaction,
                                                   walletAddress,
                                                   calculateNetBalance
                                               }: TransactionDetailModalProps) {
    const theme = useTheme();
    const textStyle = {
        color: theme.colors.onBackground,
    }

    const copyToClipboard = (text: string, message: string) => {
        Clipboard.setString(text);
        Alert.alert('Copied!', message);
    };

    if (!transaction) return null;

    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
                <View style={{
                    width: '90%',
                    backgroundColor: theme.colors.background,
                    borderRadius: 10,
                    padding: 20,
                    shadowColor: theme.colors.shadow,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                    gap: 20,
                }}>
                    <Text style={{
                        fontSize: 20,
                        marginBottom: 10,
                        fontWeight: 'bold',
                        color: theme.colors.onBackground,
                    }}>Transaction Details</Text>
                    <Divider/>
                    <Text
                        style={textStyle}>Date: {new Date(transaction.status.block_time * 1000).toLocaleString()}</Text>
                    <Text style={textStyle} onPress={() => copyToClipboard(transaction.txid, "Transaction id copied")}>📋
                        Copy Transaction Id</Text>
                    <Text style={textStyle}>Amount: {calculateNetBalance(transaction, walletAddress)}</Text>
                    <Text style={textStyle}
                          onPress={() => copyToClipboard(transaction.vin[0]?.prevout?.scriptpubkey_address, "Sender wallet address copied")}>From: 📋{transaction.vin[0]?.prevout?.scriptpubkey_address || 'N/A'}</Text>
                    <Text style={textStyle}
                          onPress={() => copyToClipboard(transaction.vout[0]?.scriptpubkey_address, "Receiver wallet address copied")}>To: 📋{transaction.vout[0]?.scriptpubkey_address || 'N/A'}</Text>
                    <Text style={textStyle}>Fee: {transaction.fee || 'N/A'}</Text>

                    <Pressable
                        style={[{
                            borderRadius: 10,
                            padding: 10,
                            marginTop: 10,
                        }, {
                            backgroundColor: theme.colors.primary,
                        }]}
                        onPress={onClose}
                    >
                        <Text style={{
                            color: theme.colors.onPrimary,
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
