import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';

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

const UserAccountCard = ({userId}: { userId: number }) => {
    const card_1 = {id: 1, name: 'Card 1', balance: 1000};
    const card_2 = {id: 2, name: 'Card 2', balance: 2000};
    const card_3 = {id: 3, name: 'Card 3', balance: 3000};
    const card_list = [card_1, card_2, card_3]
    // Mock data
    const userAccountData: UserAccount = {
        id: 1,
        name: 'John Doe',
        cards: card_list,
    };
    return (
        //for the cards make a card crouse and map the cards
        <Carousel
            data={userAccountData.cards}
            renderItem={({item, index}) => {
                return (
                    <View style={
                        {
                            backgroundColor: 'pink',
                            borderRadius: 10,
                            padding: 20,
                            marginLeft: 10,
                            marginRight: 10,
                            height: 200,
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
    );
};

export default UserAccountCard;