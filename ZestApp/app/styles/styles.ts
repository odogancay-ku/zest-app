import { StyleSheet } from 'react-native';

const createStyles = (theme: any) =>
    StyleSheet.create({
        transactionRow: {
            flexDirection: 'row',
            paddingVertical: 10,
            paddingHorizontal: 5,
            borderBottomWidth: 1,
            borderColor: '#eee',
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            width: '90%',
            backgroundColor: theme.colors.background,
            borderRadius: 10,
            padding: 20,
            alignItems: 'center',
            shadowColor: theme.colors.shadow,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        modalTitle: {
            fontSize: 20,
            marginBottom: 10,
            fontWeight: 'bold',
        },
        button: {
            borderRadius: 10,
            padding: 10,
            marginTop: 10,
        },
        buttonClose: {
            backgroundColor: theme.colors.primary,
        },
        textStyle: {
            color: theme.colors.onBackground,
            fontWeight: 'bold',
            textAlign: 'center',
        },
    });

export default createStyles;
