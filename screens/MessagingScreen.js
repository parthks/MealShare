// Login details:
// Username: parthks@umich.edu
// Password: P@ssw0rd
// https://dash.pusher.com/chatkit

import React from "react";
import { GiftedChat } from "react-native-gifted-chat";
import Chatkit from "@pusher/chatkit";
import { KeyboardAvoidingView, View, Button, AsyncStorage } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import Amplify, { Auth, API } from 'aws-amplify';


//import { Platform } from "@aws-amplify/core";
import { Platform } from 'react-native';

console.disableYellowBox = true;


let CHATKIT_TOKEN_PROVIDER_ENDPOINT = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/af5ffd03-31aa-4896-b4a5-4af348491875/token";
let CHATKIT_INSTANCE_LOCATOR = "v1:us1:af5ffd03-31aa-4896-b4a5-4af348491875";
let CHATKIT_ROOM_ID = 19375065;
let CHATKIT_USER_NAME = "User1"; // Let's chat as "Dave" for this tutorial

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


    _setAlertToNo = async() => {
        try {
            await AsyncStorage.setItem('SentAlert', 'no');
            console.log("AFTER DELETE promise ");
        } catch (error) {
            // Error saving data
        }
    }

    _setAlertToNo();

    console.log("AFTER DELETE FUNCTION ");

    let apiName = 'SafeNightAPI';
    let path = '/alert/cancel';
    //let roomInt = parseInt(room.id);

    //console.log('THIS IS THE TYPE AFTER CONVERSION ' + typeof(roomInt)) 

    let myInit = {
        body: {
            "username": CHATKIT_USER_NAME,
        },
    }

    API.post(apiName, path, myInit)
        .then(response => {
            console.log("No Errors!\n\n\n");
            console.log(response);
        }).catch(error => {
            console.log("Ran into Errors! :(\n\n\n");
            console.log(error.response)
        });

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
            title: 'Home',
            headerRight: params.TOGGLE ? < Button
                //onPress={(navigation) => navigation.navigate('HomeScreen') }
            onPress = {
                () => { deleteChat(navigation) } }
            title = ' Resolve Alert'
            color = "#0000FF" /
            >: null,
        };
    };


    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;

        // this.props.navigation.setParams({
        //             TOGGLE: false
        //       });


        CHATKIT_ROOM_ID = parseInt(this.params.roomId);
        CHATKIT_USER_NAME = this.params.username;

        let apiName = 'SafeNightAPI';
        let path = '/alert/owner';

        let myInit = {
            body: {
                "chatkit": CHATKIT_ROOM_ID.toString(),
            },
        }

        API.post(apiName, path, myInit)
            .then(response => {
                console.log("POST No Errors!\n\n\n");
                console.log(response);
                if (response.username === CHATKIT_USER_NAME) {
                    this.props.navigation.setParams({
                        TOGGLE: true
                    });


                } else {
                    this.props.navigation.setParams({
                        TOGGLE: false
                    });
                }

            }).catch(error => {
                console.log("POST ran into Errors! :(\n\n\n");
                console.log(error.response)
                this.props.navigation.setParams({
                    TOGGLE: true
                });
            });
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
            instanceLocator: 'v1:us1:af5ffd03-31aa-4896-b4a5-4af348491875',
            userId: this.params.username,
            tokenProvider: new Chatkit.TokenProvider({
                url: 'http://34.229.10.70:3001/authenticate',
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
                name: senderId,
                avatar: 'https://s3.amazonaws.com/safenight-bucket/uploads/' + senderId
            }
        };

        //console.log("SENDER ID/NAME " + senderId);
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, incomingMessage)
        }));
    }


    render() {
        return (

            <
            View style = {
                { flex: 1 } } >
            <
            GiftedChat messages = { this.state.messages }
            onSend = { messages => this.onSend(messages) }
            user = {
                {
                    _id: CHATKIT_USER_NAME
                }
            }
            /> <
            KeyboardAvoidingView behavior = { Platform.OS === 'android' ? 'padding' : null }
            keyboardVerticalOffset = { 80 } >
            <
            /KeyboardAvoidingView> 

            <
            /View>	
            /* <KeyboardAvoidingView behavior="padding" style={{flex:1}} keyboardVerticalOffset={30}>
		    </KeyboardAvoidingView> */

        )
    }
}


//
// import React from "react";
// import { GiftedChat } from 'react-native-gifted-chat';
// import Chatkit from '@pusher/chatkit';
// import {
// 	Image,
// 	Platform,
// 	ScrollView,
// 	StyleSheet,
// 	Text,
// 	TouchableOpacity,
// 	View,
// 	KeyboardAvoidingView,
// } from 'react-native';
//
// import KeyboardSpacer from 'react-native-keyboard-spacer';
// console.disableYellowBox = true;
//
// const CHATKIT_TOKEN_PROVIDER_ENDPOINT = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/af5ffd03-31aa-4896-b4a5-4af348491875/token";
// const CHATKIT_INSTANCE_LOCATOR = "v1:us1:af5ffd03-31aa-4896-b4a5-4af348491875";
// const CHATKIT_ROOM_ID = 19375065;
// const CHATKIT_USER_NAME = "User1"; // Let's chat as "Dave" for this tutorial
//
// export default class MessagingScreen extends React.Component {
// 	state = {
// 		messages: []
// 	};
//
// 	constructor(props) {
// 		super(props);
// 		//this.state = {username: this.props.navigation.state.params.username[0]};
// 		this.params = this.props.navigation.state.params;
// 	}
//
// 	componentDidMount() {
//
// 		// const tokenProvider = new Chatkit.TokenProvider({
// 		// 	url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
// 		// });
//
// 		// const chatManager = new Chatkit.ChatManager({
// 		// 	instanceLocator: CHATKIT_INSTANCE_LOCATOR,
// 		// 	userId: CHATKIT_USER_NAME,
// 		// 	tokenProvider: tokenProvider
// 		// });
//
// 		// chatManager.connect().then(currentUser => {
// 		// 	this.currentUser = currentUser;
// 		// 	this.currentUser.subscribeToRoom({
// 		// 		roomId: CHATKIT_ROOM_ID,
// 		// 		hooks: {
// 		// 			onNewMessage: this.onReceive.bind(this)
// 		// 		}
// 		// 	});
// 		// });
//
//
// 		this.params.currentUser.subscribeToRoom({
// 			roomId: this.params.roomId,
// 			hooks: {
// 				onNewMessage: this.onReceive.bind(this)
// 			}
// 		});
//
// 		this.setState({
// 			messages: [
// 				{
// 					_id: 1,
// 					text: "I think we passed the first step of the tutorial. We will now need a Pusher account!",
// 					createdAt: new Date(),
// 					user: {
// 						_id: 1,
// 						name: "React Native",
// 						avatar: "https://placeimg.com/140/140/any"
// 					}
// 				}
// 			]
//
// 		// });
// 	}
//
// 	onReceive(data) {
// 		const { id, senderId, text, createdAt } = data;
// 		const incomingMessage = {
// 			_id: id,
// 			text: text,
// 			createdAt: new Date(createdAt),
// 			user: {
// 				_id: senderId,
// 				name: senderId,
// 				avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmXGGuS_PrRhQt73sGzdZvnkQrPXvtA-9cjcPxJLhLo8rW-sVA"
// 			}
//
// 		};
//
// 		this.setState(previousState => ({
// 			messages: GiftedChat.append(previousState.messages, incomingMessage)
// 		}));
// 	}
//
// 	onSend([message]) {
// 		this.params.currentUser.sendMessage({
// 			text: message.text,
// 			roomId: this.params.roomId
// 		});
// 	}
//
// 	render() {
// 		return (
// 		<KeyboardAvoidingView style={styles.container}>
// 			<GiftedChat
// 				messages={this.state.messages}
// 				onSend={messages => this.onSend(messages)}
// 				keyboardShouldPersistTaps='never'
// 				user={{
// 					_id: this.params.username
// 				}}
// 			/>
// 		</KeyboardAvoidingView>
// 		);
// 	}
// }
//
// const styles = StyleSheet.create({
//   container: {
// 		flex: 1,
// 	},
//
// });