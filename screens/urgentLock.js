import React, { Component } from 'react';
import amplify from '../src/aws-exports';
import { RNS3 } from 'react-native-aws3';
import Chatkit from '@pusher/chatkit-client'
import Amplify, { Auth, API } from 'aws-amplify';
import { ImagePicker, Permissions, Font } from 'expo';
import { StackActions, NavigationActions } from 'react-navigation';
import { Alert, Button, StyleSheet, Text, TouchableHighlight, Image, View, ScrollView} from 'react-native';
import { AsyncStorage, ConsoleLogger } from '@aws-amplify/core';


Amplify.configure(amplify);



const logOut = async (navigation) => {
  
  try {
    console.log("IN LOGOUT FUNCTION ");
    //await AsyncStorage.clear();
    //await AsyncStorage.removeItem('Password');
    await AsyncStorage.setItem('Username', '');
    await AsyncStorage.setItem('Password', '');
    await AsyncStorage.setItem('Logout', 'yes');


    navigation.navigate('HomeScreen')
    
    //NavigationActions.navigate({ routeName: 'HomeScreen' })
    //this.props.navigation.navigate('HomeScreen');

    console.log("AFTER LOGOUT FUNCTION ");
    //.props.navigation.dismiss();
    
  } catch (error) {
    // Error saving data
  }
}

const logOutToHomeScreen = StackActions.reset({
  index: 0, // <-- currect active route from actions array
  actions: [
    NavigationActions.navigate({ routeName: 'HomeScreen' }),
  ],
});

const logOutToHomeScreenPush = StackActions.push({
  routeName: 'createAccount',
});

export default class urgentLock extends Component {

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

  

  //_storeData();
  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  constructor(props) {

    super(props);
    this.state = {
      dick: '',
      currentChatKitUser: '',
      pic: '',
      fullName: '',
      locationName: 'NOT SET',
      alertButtonText: 'Send Urgent Alert',
      roomId: '',
    };

    this.params = this.props.navigation.state.params;


    _retrieveData = async () => {
      try {
        const sentAlert = await AsyncStorage.getItem('SentAlert');
        const location = await AsyncStorage.getItem('LocationData');
        console.log('LOCATION ', location)

        if (location !== null) {
            this.setState({
            locationName: location,
          })
            console.log('HAVE SET LOCATION ', location)
             //this.props.navigation.setParams({ locationName: location })
        }

        console.log('SENT ALERT!!! ' ,sentAlert)

        if (sentAlert === 'yes') {
          this.setState({
            alertButtonText: "Go to Chat",
          })
          this.props.navigation.setParams({ sendAlertButtonText: 'Go to Chat' })
        }

        const room_id = await AsyncStorage.getItem('RoomId');
        if (room_id) {
          this.setState({
            roomId: room_id,
          })
        }


       } catch (error) {
         // Error retrieving data
         console.log('ERRRROROROROR ', error)
       }
    }

    _retrieveData();
    

    // console.log("IN CONSTRUCTOR")
    //console.log("THIS IS THE LOCATION IT SHOULD PRINT IN URGENT LOCK " + this.props.navigation.getParam('locationName', 'FUCK ME'));
    //console.log("THIS IS THE LOCATION IT SHOULD PRINT IN URGENT LOCK " + this.params.locationName)
    //console.log("THESE ARE ALL PARAMETERS IM GETTING " + this.props.navigation.state)

    // Auth.currentUserCredentials()
    // .then(() => console.log('current credentials', Auth.currentUserCredentials())
    // .catch(err => console.log('get current credentials error', err)));

    // Auth.currentSession()
    // .then(() => console.log('current Session', Auth.currentSession())
    // .catch(err => console.log("YOU SUCK", err)));

    Auth.currentUserInfo().then((userInfo) => {
      console.log(userInfo);
      this.setState(previousState => (
        {
          dick: userInfo.username,
          fullName: userInfo.attributes.family_name,
        }))
    })
  }

  // async componentWillMount() {
  //   console.log("COMPONENT WILL MOUNT CALLED")
    
  //   _retrieveData = async () => {
  //     try {
        
  //       const storedLocation = await AsyncStorage.getItem('locationName');
  //       //const storedPassword = await AsyncStorage.getItem('Password');
  //       this.setState({
  //         locationName: storedLocation,
  //       })
  //      } catch (error) {
  //        // Error retrieving data
  //      }
  //   }

  //   _retrieveData();
  
  // }


  _afterSelectPic = async () => {
    const file = {
      // `uri` can also be a file system path (i.e. file://)
      uri: this.state.pic,
      name: this.state.dick,
      type: "image/jpg"
    }

    const options = {
      keyPrefix: "uploads/",
      bucket: "safenight-bucket",
      region: "us-east-1",
      accessKey: "AKIAJZWABVONGSRDMRFA",
      secretKey: "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",
      successActionStatus: 201
    }

    RNS3.put(file, options).then(response => {
      this.forceUpdate();

      if (response.status !== 201)
        throw new Error("Failed to upload image to S3");
      console.log(response.body);
    });


  }

  _pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
        // @ts-ignore
        base64: true,
        //mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.cancelled) {
        this.onChangeText('pic', result.uri)
        this._afterSelectPic();
      } else {
        console.log(TAG, `image selection cancelled\n`);
      }
    } else {
      // show info to user
      console.log("This shit broke");
      alert("Man homes this wack")
    }
  };

  _uploadImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
        // @ts-ignore
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.cancelled) {
        this.onChangeText('pic', result.uri)
        this._afterSelectPic();
      } else {
        console.log(TAG, `image selection cancelled\n`);
      }
    } else {
      // show info to user
      console.log("This shit broke");
      alert("Man homes this wack")
    }
  };

  // setLocation() { // GET Request
  //   //alert("Should be setting the location");
  //   this.props.navigation.navigate('UrgentScreen', {
  //   })

  // }

  clearLocation() { // POST Request
    //alert("Location is cleared. Please set a new location");

    let apiName = 'SafeNightAPI';
    let path = '/location/clear';

    let myInit = {
        body: {
          "username": this.state.dick,
        },
    }

    API.post(apiName, path, myInit)
      .then(response => {
        console.log("POST No Errors!\n\n\n");
        console.log(response);
      }).catch(error => {
        console.log("POST ran into Errors! :(\n\n\n");
        console.log(error.response)
      });
  }

  createChat () {
      const chatManager = new Chatkit.ChatManager({
        instanceLocator: 'v1:us1:af5ffd03-31aa-4896-b4a5-4af348491875',
        userId: this.state.dick,
        tokenProvider: new Chatkit.TokenProvider({
          url: 'http://34.229.10.70:3001/authenticate',
        }),
      })

      chatManager
        .connect()
        .then(currentUser => {
          currentUser.createRoom({
            name: 'Help '+this.state.dick,
            addUserIds: [this.state.dick],
            //customData: { foo: 42 },
          }).then(room => {
              console.log(`Created room called ${room.name}`)
              console.log('THIS IS THE ROOM ID ' + room.id)
              console.log('THIS IS THE TYPE OF THE ROOM ID VARIABLE ' + typeof(room.id))
              console.log('THIS IS THE USER THAT NEEDS HELP ' + this.state.dick)

              this.setState({
                roomId: room.id
              })

              _setRoomId = async () => {
                  try {
                    await AsyncStorage.setItem('RoomId', room.id);
                    await AsyncStorage.setItem('SentAlert', 'yes');

                  } catch (error) {
                    // Error saving data
                  }
              }

              _setRoomId();

              let apiName = 'SafeNightAPI';
              let path = '/alert/send';
              //let roomInt = parseInt(room.id);

              //console.log('THIS IS THE TYPE AFTER CONVERSION ' + typeof(roomInt)) 

              let myInit = {
                  body: {
                    "username": this.state.dick,
                    "chatkit": room.id,
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



              var aws_url = 'https://s3.amazonaws.com/safenight-bucket/uploads/' + this.state.dick
              console.log('THIS IS THE ATTACHEMENT LINK ' + aws_url)
              currentUser.sendMessage({
                text: "Please Help Me!!!!!!!",
                roomId: room.id,
                name: this.state.dick,
                attachment: {
                  link: aws_url,
                  type: "image"
                }
              })
              .then(messageId => {
                console.log(`Added message to ${room.name}`)
                this.setState({
                  alertButtonText: "Go to Chat"
                })

                this.props.navigation.navigate('MessagingScreen', {
                  username: this.state.dick,
                  roomId: room.id,
                  currentUser: currentUser,
                })
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



  ChangeButtonTitle = () => {

    if (this.props.navigation.getParam('locationName', 'NOT SET') === 'NOT SET'
        ) {
      alert('Please set a location')
      return
    }

    _retrieveData = async () => {

      try {
        const sentAlert = await AsyncStorage.getItem('SentAlert');
        console.log('sentAlert' + sentAlert)

        if (sentAlert === 'no' || this.state.alertButtonText === 'Send Urgent Alert') {
          console.log('SENT ALERT IS ' + sentAlert)
          console.log(' ALERT BUTTON STATE IS ' + this.state.alertButtonText)

          this.setState({
            alertButtonText: "Go to Chat",
          })
          this.props.navigation.setParams({ sendAlertButtonText: 'Go to Chat' })

          this.createChat();

         
        } else {

          console.log('SENT ALERT IS ' + sentAlert)
          console.log(' ALERT BUTTON STATE IS ' + this.state.alertButtonText)

          this.props.navigation.navigate('MessagingScreen', {
            username: this.state.dick,
            roomId: this.state.roomId,
          })
          
          // this.setState({
          //   alertButtonText: "Send Urgent Alert",
          // })

           

        }

      
        }





       catch (error) {
         // Error retrieving data
       }
    }

    _retrieveData();

    console.log('STATE' + this.state.alertButtonText)


    
    
  }
  
  

  render() {
    const {navigation } = this.props; 
    const locationalName = navigation.getParam('locationName', 'NOT SET');
    const sendAlertButtonText = navigation.getParam('sendAlertButtonText', this.state.alertButtonText);

    return (
      

      <View style={{
        flex: 1,
        flexDirection: 'column'
      }}>

        <View style={styles.overallContainer}>
          <ScrollView style={styles.overallContainer} contentContainerStyle={ styles.centering }>

            <Image source={{uri: 'https://s3.amazonaws.com/safenight-bucket/uploads/' + this.state.dick + '?' + new Date()}} style={styles.profileImage}/>
            <Text style={ styles.welcomeUser }> Hello {this.state.fullName}!</Text>

            <View style={ styles.tenPadding } />

            <TouchableHighlight
              style={ styles.urgentButton }
              onPress={() => this.ChangeButtonTitle() }
            >
              <Text style={ styles.ButtonText }>{sendAlertButtonText}</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={ styles.photoButton }
              onPress={ this._pickImage }
            >
              <Text style={ styles.ButtonText }>Take a photo and upload it</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={ styles.photoButton }
              onPress={ this._uploadImage }
            >
              <Text style={ styles.ButtonText }>Upload from Camera Roll</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={ styles.nearbyAlertsButton }
              onPress={ () => this.props.navigation.navigate('listAlerts') }
            >
              <Text style={ styles.ButtonText }>Check Nearby Alerts</Text>
            </TouchableHighlight>

            <View style= { styles.LocationSection }>
              <Text style={ styles.LocationTitle }> Location Services</Text>
              <Text style={ styles.CurrentLocation }> Your current set location is: </Text>
              <Text style={ styles.CurrentLocation }> {JSON.stringify(locationalName)}</Text>

              <View style={{flexDirection: "row"}}>
                <TouchableHighlight
                  style={ styles.LocationButton }
                  onPress={() => {this.clearLocation(); this.props.navigation.navigate('UrgentScreen')}}
                >
                  <Text style={ styles.ButtonText }>Set New Location</Text>
                </TouchableHighlight>

                {/* <TouchableHighlight
                  style={ styles.LocationButton }
                  onPress={() => {this.clearLocation() 
                  locationalName = 'NOT SET'
                  }
                  }
                >
                  <Text style={ styles.ButtonText }>Clear Location</Text>
                </TouchableHighlight> */}
              </View>

            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centering: {
    paddingTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overallContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  LocationSection: {
    paddingTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  LocationTitle: {
    fontSize: 30,
    color: 'green',
    fontFamily: 'roboto-condensed-regular',
    textDecorationLine: 'underline',
  },
  CurrentLocation: {
    fontSize: 15,
    color: 'gray',
    fontFamily: 'roboto-condensed-regular',
  },
  LocationButton: {
    width: '30%',
    padding: 10,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    margin: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    // Circular image
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fff',
    borderRadius: 50,
  },
  welcomeUser: {
    fontSize: 20,
    padding: 10,
    color: 'red',
    fontFamily: 'roboto-condensed-regular',
  },
  urgentButton: {
    width: '50%',
    padding: 10,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 10,
  },
  ButtonText: {
    fontSize: 15,
    color: 'white',
  },
  photoButton: {
    width: '60%',
    padding: 10,
    backgroundColor: '#FF69B4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    margin: 10,
  },

  nearbyAlertsButton: {
    width: '60%',
    padding: 10,
    backgroundColor: '#66CD00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    margin: 10,
  },

  tenPadding: {
    padding: 10,
  },
});
