
import React, { Fragment } from 'react';
import { Platform, StatusBar, ScrollView, StyleSheet, View, Text, Button, TouchableHighlight } from 'react-native';
import * as firebase from "firebase";
import Chatkit from '@pusher/chatkit-client'



export default class foodList extends React.Component {
 
static navigationOptions = ({navigation, screenProps }) => ({
    title: "Bri's Muffin Shop",
});
 constructor(props) {
     super(props);
     this.params = this.props.navigation.state.params.id; 
     this.state = {
         foods: [{name:'Chocolate Chip Muffin', price:'$3.00'}, {name:'Blueberry Muffin', price: '$3.00'}, {name: 'Plain Muffin', price: '$3.00'}],
     }
 }

 joinChat(foodname) {

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
          currentUser.createRoom({
            name: 'Test'
            //addUserIds: [dick],
            //customData: { foo: 42 },
          }).then(room => {
              console.log(`Created room called ${room.name}`)
              console.log('THIS IS THE ROOM ID ' + room.id)
              console.log('THIS IS THE TYPE OF THE ROOM ID VARIABLE ' + typeof(room.id))
              console.log('THIS IS THE USER THAT NEEDS HELP ' + dick)

              currentUser.sendMessage({
                text: "Hi this is Kishan",
                roomId: room.id,
                name: dick,
              })
              .then(messageId => {
                console.log(`Added message to ${room.name}`)
                //alert('DONE!');
                this.props.navigation.navigate('MessagingScreen', {
                    roomId: room.id,
                });
                
              })
              .catch(err => {
                console.log(`Error adding message to ${room.name}: ${err}`)
              })

              currentUser.sendMessage({
                text: "I would like to order a "+foodname,
                roomId: room.id,
                name: dick,
              })
              .then(messageId => {
                console.log(`Added message to ${room.name}`)
                //alert('DONE!');
                this.props.navigation.navigate('MessagingScreen', {
                    roomId: room.id,
                });
                
              })
              .catch(err => {
                console.log(`Error adding message to ${room.name}: ${err}`)
              })

              currentUser.sendMessage({
                text: "I am currently at 2101 Bonisteel Blvd",
                roomId: room.id,
                name: dick,
              })
              .then(messageId => {
                console.log(`Added message to ${room.name}`)
                //alert('DONE!');
                this.props.navigation.navigate('MessagingScreen', {
                    roomId: room.id,
                });
                
              })
              .catch(err => {
                console.log(`Error adding message to ${room.name}: ${err}`)
              })

          })
          .catch(err => {
            console.log(`Error creating room ${err}`)
          })
          //this.setState({ currentChatKitUser: currentUser })
       })
       .catch(error => console.error('error', error))

  }


 render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          <View>
          {
              this.state.foods.map((p) => {
                return (
                    <React.Fragment>
                      <View style={styles.individual_pic_container}>
                        <TouchableHighlight
                          style={styles.logPassButton}
                          onPress={() => { this.joinChat(p.name) } }
                          // onPress={() => this.joinChat(p.room)}
                        >
                          <Text style={styles.buttonText}>{p.name} - {p.price}</Text>
                          
  
                        </TouchableHighlight>
                      </View>
                    </React.Fragment>
                );
              })
            
            }
          
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9d9d9',
  },
  contentContainer: {
    // paddingTop: 30,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    // paddingHorizontal: 40,
  },
  title: {
    fontSize: 30,
    color: 'rgba(252, 45, 5, 1)',
    lineHeight: 24,
    textAlign: 'center',
    paddingTop: 30,
  },
  individual_pic: {
    width: 350,
    height: 350,
  },
  individual_pic_container: {
    justifyContent: 'space-evenly',
    alignItems:'center',
  },
  individual_name: {
    fontSize: 0,
    textAlign: 'center',
  },
  individual: {
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  room_redirect: {
    backgroundColor: 'orange',
  },

  logPassButton: {
    width: '80%',
    height: 50,
    padding: 10,
    margin: 20, 
    backgroundColor: '#6666FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    //color: "white"
    //position: 'absolute',
    //top: '80%',
    //left: '30%',
    //zIndex: 5,
  },

  buttonText: {
      color: 'white', 
      fontWeight: 'bold', 
      fontSize: 15, 
  }
});