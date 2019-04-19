// Login details:
// Username: parthks@umich.edu
// Password: P@ssw0rd
// https://dash.pusher.com/chatkit

import React from "react";
import { Platform, StatusBar, StyleSheet, View, Text, Button, Image, TouchableHighlight } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import Chatkit from "@pusher/chatkit-client";



export default class Profile extends React.Component {

startChat() {
    var dick = 'testuser'

    chatManager = new Chatkit.ChatManager({
      instanceLocator: 'v1:us1:75aeba04-a7ad-4d62-9d2d-ac937c8d2502',
      userId: 'testuser',
      tokenProvider: new Chatkit.TokenProvider({
        url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/75aeba04-a7ad-4d62-9d2d-ac937c8d2502/token',
      }),
    })

    chatManager
        .connect()
        .then(currentUser => {
            this.props.navigation.navigate('MessagingScreen', {
                    roomId: '19391792',
                });
        })
}

render() {
    return (
            <View style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}> 

            <Image
          source={require('../assets/images/robot-prod.png')}
            />

            <Text style={styles.info}>Name: Anne</Text>
            <Text style={styles.big}>Delivers: Yes</Text>

            <TouchableHighlight
              style={ styles.hangryButton }
              onPress={ () => this.startChat() }
            >
              <Text style={ styles.ButtonText }>Message Anne</Text>
            </TouchableHighlight>
            
            </View>
        

        );
  }
}

const styles = StyleSheet.create({
    ButtonText: {
        fontSize: 20,
        color: "black"
    },
    address: {
    textAlign: 'center',
    fontSize: 30,
    paddingBottom: 30,
    },
    info: {
    textAlign: 'center',
    fontSize: 30,
    paddingTop: 30,
    },
    big: {
    textAlign: 'center',
    fontSize: 30,
    },
    hangryButton: {
        width: '70%',
        height: '20%',
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
