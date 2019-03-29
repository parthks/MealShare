
import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, Button, TouchableHighlight } from 'react-native';
import * as firebase from "firebase";


logOut = async (navigation) => {
    try {
        await firebase.auth().signOut();
        navigation.navigate('LoginScreen');
    } catch (e) {
        console.log(e);
    }
}

export default class HomeScreen extends React.Component {

    static navigationOptions = ({navigation, screenProps }) => ({
        title: 'Home',
        headerRight:
          <Button
            //onPress={(navigation) => navigation.navigate('HomeScreen') }
            onPress={() => {logOut(navigation)}}
            title="LOG OUT"
            color="#0000FF"
          />,
        headerLeft:
          null
      });

       

render() {
    return (
        <View>
            <TouchableHighlight
              style={ styles.hangryButton }
              onPress={ () => this.props.navigation.navigate('MapScreen') }
            >
              <Text style={ styles.ButtonText }>Hungry?</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={ styles.moneyButton }
              onPress={ () => {alert("Contact us!");} }
            >
              <Text style={ styles.ButtonText }>Make Money!</Text>
            </TouchableHighlight>

        </View>
    )

}

}

const styles = StyleSheet.create({
    ButtonText: {
        fontSize: 50,
        color: "white"
    },
    hangryButton: {
        width: '90%',
        height: '45%',
        padding: 10,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 5,
        marginLeft: 20,
        backgroundColor: '#A594F9',
        justifyContent: 'center',
        alignItems: 'center',
      },

    moneyButton: {
        width: '90%',
        height: '45%',
        padding: 10,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 5,
        marginLeft: 20,
        backgroundColor: '#A594F9',
        justifyContent: 'center',
        alignItems: 'center',
      },
});