import React, { Fragment } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, TouchableHighlight, View, } from 'react-native';
import { Auth, API } from 'aws-amplify';
import Chatkit from '@pusher/chatkit-client'



export default class HomeScreen extends React.Component {
  // Constructor run immediately on call.
  static navigationOptions = {
    title: 'Current Alerts',
    headerStyle: {
      backgroundColor: "#6666ff"
    },

    headerTintColor: "#fff",
  };

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      people: [],
    };

    this.params = this.props.navigation.state.params;

    // Setting the user
    Auth.currentUserInfo()
      .then((userInfo) => {
        this.setState(previousState => ({
          username: userInfo.username
        }))
        this.checkAlerts()
      })

  }

  checkAlerts() {
    let apiName = 'SafeNightAPI';
    let path = '/alert/check';

    let myInit = {
        body: {
          "username": this.state.username,
        },
    }

    API.post(apiName, path, myInit)
      .then(response => {
        console.log("No Errors!\n\n\n");
        this.setState(previousState => ({
          people: response.people,
        }))
        console.log(response);


      }).catch(error => {
        console.log("Check Alerts Error! :(\n\n\n");
        console.log(error.response)
      });
  }

  joinChat(roomId_value) {

    const chatManager = new Chatkit.ChatManager({
      instanceLocator: 'v1:us1:af5ffd03-31aa-4896-b4a5-4af348491875',
      userId: this.state.username,
      tokenProvider: new Chatkit.TokenProvider({
        url: 'http://34.229.10.70:3001/authenticate',
      }),
    })
    console.log(roomId_value);

    chatManager
      .connect()
      .then(currentUser=> {
        currentUser.joinRoom({ roomId: roomId_value})

        .then(room => {
          console.log(`Joined room with ID: ${room.id}`)

          console.log(`Navigating to ${room.name}`)
          // this.props.navigation.navigate('MessagingScreen')
          this.props.navigation.navigate('MessagingScreen', {
            username: this.state.username,
            roomId: room.id,
            currentUser: currentUser,
          })
        })
        .catch(err => {
          console.log(`Error joining room ${roomId_value}: ${err}`)
        })
      })
      .catch(err => console.log(`Could not find the current user: ${err}`))

  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }



  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          <View>
          {
            this.state.people.map((p)=>{
              return (
                <View style={styles.individual} key={p.id}>
                  <React.Fragment>
                    <Text style={styles.individual_name}>{p.name}</Text>
                    <View style={styles.individual_pic_container}>
                      <TouchableHighlight
                        style={styles.room_redirect}
                        onPress={() => this.joinChat(p.room)}
                      >
                        <Image source={ p.pic } style={styles.individual_pic}/>

                      </TouchableHighlight>
                    </View>
                  </React.Fragment>
                </View>
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
});
