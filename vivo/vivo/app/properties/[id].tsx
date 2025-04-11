import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PropertyProps {
    id: string;
}

const Property: React.FC<PropertyProps> = ({ id }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Property ID: {id}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5fcff',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

export default Property;