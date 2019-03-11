import React, {Fragment} from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { TextInput } from 'react-native-gesture-handler';
import { ImagePicker, Permissions, LinearGradient } from 'expo';
import { AsyncStorage, Image, ScrollView, StyleSheet, Text, View, Button, KeyboardAvoidingView, TouchableHighlight, Platform } from 'react-native';
import * as firebase from "firebase";  




const initialState = {
  family_name: '', password: '', email: '', picture:'', showConfirmationForm: false
}

export default class createAccount extends React.Component {
  state = initialState

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  constructor(props) {
    super(props);

    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  focusNextField(id) {
    this.inputs[id].focus();
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
        this.onChangeText('picture', result.uri)
        

      } else {
        console.log(TAG, `image selection cancelled\n`);
      }
    } else {
      // show info to user
      console.log("This shit broke");
      alert("Man homes this wack")
    }
  };
  
  uploadFirebaseImage = async (uri) => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  
    const ref = firebase
      .storage()
      .ref()
      .child(firebase.auth().currentUser.uid);
    const snapshot = await ref.put(blob);
  
    // We're done with the blob, close and release it
    blob.close();
  
    return await snapshot.ref.getDownloadURL();
  }
//  uploadFirebaseImage(uri, mime = 'application/octet-stream') {
//     return new Promise((resolve, reject) => {
//       const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
//       let uploadBlob = null

//       const imageRef = firebase.storage().ref('images').child(firebase.auth().currentUser.uid)
//       const Blob = RNFetchBlob.polyfill.Blob
//       const fs = RNFetchBlob.fs
//       window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
//       window.Blob = Blob

//       fs.readFile(uploadUri, 'base64')
//         .then((data) => {
//           return Blob.build(data, { type: `${mime};BASE64` })
//         })
//         .then((blob) => {
//           uploadBlob = blob
//           return imageRef.put(blob, { contentType: mime })
//         })
//         .then(() => {
//           uploadBlob.close()
//           return imageRef.getDownloadURL()
//         })
//         .then((url) => {
//           resolve(url)
//         })
//         .catch((error) => {
//           reject(error)
//       })
//     })
//   }
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
        this.onChangeText('picture', result.uri);
        

      } else {
        console.log(TAG, `image selection cancelled\n`);
      }
    } else {
      // show info to user
      console.log("This shit broke");
      alert("Man homes this wack")
    }
  };

  signUp = async () => {
    const { family_name, email, password, phone_number, picture} = this.state
    try {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
          // If you need to do anything with the user, do it here
          // The user will be logged in automatically by the
          // `onAuthStateChanged` listener we set up in App.js earlier
          //alert('registered')
          //firebase.database.ref('users/').set({email: family_name});
          alert("created accounts you fuck");
          this.uploadFirebaseImage(this.state.picture)
            .then(url => { 
              alert('uploaded'); 

              firebase.database().ref('users/').push({
                email,
                family_name,
                url, 
                phone_number
            }).then((data)=>{
                //success callback
                alert("in data");
    
                console.log('data ' , data)
    
            }).catch((error)=>{
                //error callback
                
                console.log('error ' , error)
            })
            })
            .catch(error => console.log(error))
          

        })
        .catch((error) => {
          const { code, message } = error;
          console.log(error)
          alert(message)
          // For details of error codes, see the docs
          // The message contains the default Firebase string
          // representation of the error
        });
        
      //console.log('user successfully signed up!: ', success)
      this.setState({ showConfirmationForm: true })

      

      // await AsyncStorage.setItem('Username', username);
      // await AsyncStorage.setItem('Password', password);

      // _storeData = async () => {
      //   try {
      //     await AsyncStorage.setItem('Username', username);
      //     await AsyncStorage.setItem('Password', password);
      //   } catch (error) {
      //     // Error saving data
      //   }
      // }

      //_storeData();

      

        const file = {
          // `uri` can also be a file system path (i.e. file://)
          uri: picture,
          //name: username,
          type: "image/jpg"
        }

    } catch (err) {
      console.log('error signing up: ', err)
      if (typeof(err) === 'string') {
        alert(err)
      } else if (typeof(err) === 'object') {
        alert(err.message)
      }
    }
  }

  // confirmSignUp = async () => {
  //   const { username, authenticationCode } = this.state
  //   try {
  //     await Auth.confirmSignUp(username, authenticationCode)
  //     console.log('successully signed up!')
  //     alert('User signed up successfully!')
  //     this.setState({ ...initialState })
  //     this.props.navigation.navigate('HomeScreen')
  //   } catch (err) {
  //     console.log('error confirming signing up: ', err)
  //     //this.props.navigation.navigate('HomeScreen')
  //   }
  // }

  render() {
    let { picture } = this.state;

    return (
      <View
        style={styles.container}
      >

      <LinearGradient
        colors={['#E5D9F2', '#FFF']}
        style={{
          alignItems: 'center',
          borderRadius: 5,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: 'center',
         }}
      >
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/logo.png')
                  : require('../assets/images/logo.png')
              }
              style={styles.welcomeImage}
            />
          </View>
          <ScrollView>

          <View style={styles.getStartedContainer}>
            <View style={ styles.genInfo }>
              <Text style={styles.info}>
                Passwords must longer than 6 characters, contain at least one numeric value, and one symbol
              </Text>
              <Text style={styles.info}>
                Please start the phone number with +1
              </Text>
            </View>

            <Text style={styles.getStartedText}>Register for an account now.</Text>

            { !this.state.showConfirmationForm && (
              <Fragment>
                <TextInput
                  style={styles.inputFields}
                  placeholder="Name"
                  onChangeText={val => this.onChangeText('family_name', val)}

                  blurOnSubmit={ false }
                  onSubmitEditing={() => {
                    this.focusNextField('two');
                  }}
                  returnKeyType={ "next" }
                  ref={ input => {
                    this.inputs['one'] = input;
                  }}
                />

                {/* <TextInput
                  style={styles.inputFields}
                  placeholder="Username"
                  onChangeText={val => this.onChangeText('username', val)}

                  blurOnSubmit={ false }
                  onSubmitEditing={() => {
                    this.focusNextField('three');
                  }}
                  returnKeyType={ "next" }
                  ref={ input => {
                    this.inputs['two'] = input;
                  }}
                /> */}

                <TextInput
                  style={styles.inputFields}
                  placeholder="Email"
                  //onChangeText={(text) => {this.setState({text})}}
                  onChangeText={val => this.onChangeText('email', val)}

                  blurOnSubmit={ false }
                  onSubmitEditing={() => {
                    this.focusNextField('four');
                  }}
                  returnKeyType={ "next" }
                  ref={ input => {
                    this.inputs['three'] = input;
                  }}
                />

                <TextInput
                  style={styles.inputFields}
                  placeholder="Password"
                  onChangeText={val => this.onChangeText('password', val)}

                  blurOnSubmit={ false }
                  onSubmitEditing={() => {
                    this.focusNextField('five');
                  }}
                  returnKeyType={ "next" }
                  ref={ input => {
                    this.inputs['four'] = input;
                  }}
                />

                <TextInput
                  style={styles.inputFields}
                  placeholder="Phone Number"
                  //onChangeText={(text) => {this.setState({text})}}
                  onChangeText={val => this.onChangeText('phone_number', val)}

                  blurOnSubmit={ true }
                  returnKeyType={ "done" }
                  ref={ input => {
                    this.inputs['five'] = input;
                  }}
                />

                <TouchableHighlight
                  style={ styles.defaultBTN }
                  onPress={this._pickImage}
                  >
                  <Text style={ styles.defaultBTNtext }>Take a photo and upload it</Text>
                </TouchableHighlight>

                <Text style={ styles.or }>OR</Text>

                <TouchableHighlight
                  style={ styles.defaultBTN }
                  onPress={this._uploadImage}
                  >
                  <Text style={ styles.defaultBTNtext }>Upload from Camera Roll</Text>
                </TouchableHighlight>

           {picture ?
             <Image source={{ uri: picture }} style={{ width: 200, height: 200 }} />
           : null}

                <TouchableHighlight
                  style={ styles.signupBTN }
                  onPress = {this.signUp
                  }
                  >
                  <Text style={ styles.signupBTNtext }>Sign Up</Text>
                </TouchableHighlight>

            </Fragment>

            )}

            {/* { this.state.showConfirmationForm && (
                <Fragment>
                  <TextInput
                    style={styles.input}
                    placeholder='Authentication code'
                    autoCapitalize="none"
                    placeholderTextColor='gray'
                    onChangeText={val => this.onChangeText('authenticationCode', val)}
                  />
                  <Button
                    title='Confirm Sign Up'
                    onPress={this.confirmSignUp}
                  />
                </Fragment>
              )} */}

            <KeyboardSpacer/>

          </View>
          </ScrollView>


      </LinearGradient>


      </View>
    );
  }

}

const styles = StyleSheet.create({
  defaultBTN: {
    width: 200,
    padding: 10,
    backgroundColor: '#A594F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 5,
    marginTop: 5,
  },
  defaultBTNtext: {
    fontSize: 15,
    color: 'white',
  },
  signupBTN: {
    width: 150,
    padding: 15,
    backgroundColor: '#6666FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 5,
    marginBottom: 25,
  },
  signupBTNtext: {
    fontSize: 25,
    color: 'white',
  },
  or: {
    fontSize: 15,
    color: 'gray',
  },
  info: {
    fontSize: 13,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  genInfo:{
    paddingBottom: 10,
  },
  inputFields: {
    height: 25,
    width: 200,
    borderBottomColor: '#A594F9',
    borderBottomWidth: 2,
    marginBottom: 10,
    color: '#6666FF',
    fontSize: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
