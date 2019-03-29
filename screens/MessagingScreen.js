// Login details:
// Username: parthks@umich.edu
// Password: P@ssw0rd
// https://dash.pusher.com/chatkit

import React from "react";
import { GiftedChat } from "react-native-gifted-chat";
import Chatkit from "@pusher/chatkit";
import { KeyboardAvoidingView, View, Button, AsyncStorage } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';


import { Platform } from 'react-native';

console.disableYellowBox = true;


let CHATKIT_ROOM_ID = '';
let CHATKIT_USER_NAME = ""; 

let CURRENTUSER = ''

const deleteChat = async(navigation) => {


    try {
        console.log("IN DELETE FUNCTION ");

        console.log(`CURRENTUSER: ${CURRENTUSER}`)

        CURRENTUSER.deleteRoom({ roomId: CHATKIT_ROOM_ID })
            .then(() => {
                console.log(`Deleted room with ID: ${CHATKIT_ROOM_ID}`)
            })
            .catch(err => {
                console.log(`Error deleted room ${CHATKIT_ROOM_ID}: ${err}`)
            })
    } catch (error) {
        // Error saving data
        console.log("DELETE FUNCTION ");
    }


    // _setAlertToNo = async() => {
    //     try {
    //         await AsyncStorage.setItem('SentAlert', 'no');
    //         console.log("AFTER DELETE promise ");
    //     } catch (error) {
    //         // Error saving data
    //     }
    // }

    // _setAlertToNo();

    console.log("AFTER DELETE FUNCTION ");

    console.log("IN DELETE FUNCTION ");


    navigation.navigate('urgentLock', {
        sendAlertButtonText: 'Send Urgent Alert'
    })

    //NavigationActions.navigate({ routeName: 'HomeScreen' })
    //this.props.navigation.navigate('HomeScreen');


    //.props.navigation.dismiss();

}










export default class MyChat extends React.Component {
    state = {
        messages: [],
    };


    static navigationOptions = ({ navigation, screenProps }) => {
        const { params = {} } = navigation.state;
        return {
            title: "Order With Bri's Muffin Shop",
            // headerRight: params.TOGGLE ? < Button
            //     //onPress={(navigation) => navigation.navigate('HomeScreen') }
            // onPress = {
            //     () => { deleteChat(navigation) } }
            // title = ' Resolve Alert'
            // color = "#0000FF" /
            // >: null,
        };
    };


    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;

        CHATKIT_ROOM_ID = parseInt(this.params.roomId);
        CHATKIT_USER_NAME = 'testuser';

    }

    componentDidMount() {
        // // This will create a `tokenProvider` object. This object will be later used to make a Chatkit Manager instance.
        // const tokenProvider = new Chatkit.TokenProvider({
        // 	url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
        // });
        //
        // // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
        // // For the purpose of this example we will use single room-user pair.
        // const chatManager = new Chatkit.ChatManager({
        // 	instanceLocator: CHATKIT_INSTANCE_LOCATOR,
        // 	userId: CHATKIT_USER_NAME,
        // 	tokenProvider: tokenProvider
        // });
        const chatManager = new Chatkit.ChatManager({
            instanceLocator: 'v1:us1:75aeba04-a7ad-4d62-9d2d-ac937c8d2502',
            userId: 'testuser',
            tokenProvider: new Chatkit.TokenProvider({
              url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/75aeba04-a7ad-4d62-9d2d-ac937c8d2502/token',
            }),
          })

        // In order to subscribe to the messages this user is receiving in this room, we need to `connect()` the `chatManager` and have a hook on `onNewMessage`. There are several other hooks that you can use for various scenarios. A comprehensive list can be found [here](https://docs.pusher.com/chatkit/reference/javascript#connection-hooks).
        chatManager.connect().then(currentUser => {
            this.currentUser = currentUser;
            CURRENTUSER = currentUser
            this.currentUser.subscribeToRoom({
                roomId: CHATKIT_ROOM_ID,
                hooks: {
                    onNewMessage: this.onReceive.bind(this)
                }
            });
        });
    }

    onSend([message]) {
        this.currentUser.sendMessage({
            text: message.text,
            roomId: CHATKIT_ROOM_ID
        });
    }

    onReceive(data) {
        const { id, senderId, text, createdAt } = data;
        // console.log("THIS IS THE DATA ATTACHMENT LINK " + data.attachment.link);
        // console.log("THIS IS THE DATA ATTACHMENT TYPE " + data.attachment.type);
        // console.log("THIS IS THE DATA ATTACHMENT NAME " + data.attachment.name);
        var attached = null;

        if (data.attachment) {
            attached = data.attachment.link;
        }

        const incomingMessage = {
            _id: id,
            text: text,
            image: attached,
            createdAt: new Date(createdAt),
            user: {
                _id: senderId,
                name: senderId
                //avatar: 'https://s3.amazonaws.com/safenight-bucket/uploads/' + senderId
            }
        };

        //console.log("SENDER ID/NAME " + senderId);
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, incomingMessage)
        }));
    }


render() {
    return (

		<View style={{flex: 1}}>
			<GiftedChat
				messages={this.state.messages}
				onSend={messages => this.onSend(messages)}
				user={{
	       	_id: CHATKIT_USER_NAME
     		}}
			/>
			 <KeyboardAvoidingView behavior={ Platform.OS === 'android' ? 'padding' : null} keyboardVerticalOffset={80}>
		    </KeyboardAvoidingView>

		</View>

		)
  }
}
