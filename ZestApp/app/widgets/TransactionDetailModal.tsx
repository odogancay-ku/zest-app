import React, {useEffect} from 'react';
import {Modal, View, Pressable, Text, Clipboard, ToastAndroid, Alert} from 'react-native';
import {Divider, useTheme} from 'react-native-paper';
import createStyles from '@/app/styles/styles';
import {TransactionHistory} from "@/models/models";

interface TransactionDetailModalProps {
    visible: boolean;
    onClose: () => void;
    transaction: TransactionHistory;
    walletAddress: string;
}

export default function TransactionDetailModal({
                                                   visible,
                                                   onClose,
                                                   transaction,
                                                   walletAddress
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
                        style={textStyle}>Date: {new Date(transaction.date).toLocaleString()}</Text>
                    <Text style={textStyle} onPress={() => copyToClipboard(transaction.id, "Transaction id copied")}>📋
                        Copy Transaction Id</Text>
                    <Text style={textStyle}>Amount: {transaction.amount}</Text>
                    <Text style={textStyle}
                          onPress={() => copyToClipboard(transaction.senderWalletAddress, "Sender wallet address copied")}>From: 📋{transaction.senderWalletAddress || 'N/A'}</Text>
                    <Text style={textStyle}
                          onPress={() => copyToClipboard(transaction.receiverWalletAddress, "Receiver wallet address copied")}>To: 📋{transaction.receiverWalletAddress || 'N/A'}</Text>
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
