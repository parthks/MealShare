import React, {Fragment} from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { TextInput } from 'react-native-gesture-handler';
import { ImagePicker, Permissions, LinearGradient } from 'expo';
import { AsyncStorage, Image, ScrollView, StyleSheet, Text, View, Button, KeyboardAvoidingView, TouchableHighlight } from 'react-native';



const initialState = {
  family_name: '', password: '', email: '', picture:'', showConfirmationForm: false
}

export default class HomeScreen extends React.Component {
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

  signUp = async () => {
    const { family_name, username, email, password, phone_number, picture} = this.state
    try {
      const success = await Auth.signUp({ family_name, username, password, email, phone_number, attributes: { family_name, email, phone_number, picture }})
      console.log('user successfully signed up!: ', success)
      this.setState({ showConfirmationForm: true })

      let apiName = 'SafeNightAPI';
      let path = '/account/create';

      let myInit = {
          body: {
            "username": username,
            "family_name": family_name,
            "email": email,
            "phone_number": phone_number,
            "picture": username
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

      // await AsyncStorage.setItem('Username', username);
      // await AsyncStorage.setItem('Password', password);

      _storeData = async () => {
        try {
          await AsyncStorage.setItem('Username', username);
          await AsyncStorage.setItem('Password', password);
        } catch (error) {
          // Error saving data
        }
      }

      _storeData();

      fetch('http://34.229.10.70:3001/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        })

        const file = {
          // `uri` can also be a file system path (i.e. file://)
          uri: picture,
          name: username,
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
          if (response.status !== 201)
            throw new Error("Failed to upload image to S3");
          console.log(response.body);
        });

    } catch (err) {
      console.log('error signing up: ', err)
      if (typeof(err) === 'string') {
        alert(err)
      } else if (typeof(err) === 'object') {
        alert(err.message)
      }
    }
  }

  confirmSignUp = async () => {
    const { username, authenticationCode } = this.state
    try {
      await Auth.confirmSignUp(username, authenticationCode)
      console.log('successully signed up!')
      alert('User signed up successfully!')
      this.setState({ ...initialState })
      this.props.navigation.navigate('HomeScreen')
    } catch (err) {
      console.log('error confirming signing up: ', err)
      //this.props.navigation.navigate('HomeScreen')
    }
  }

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

                <TextInput
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
                />

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
                  onPress = {this.signUp}
                  >
                  <Text style={ styles.signupBTNtext }>Sign Up</Text>
                </TouchableHighlight>

            </Fragment>

            )}

            { this.state.showConfirmationForm && (
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
              )}

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
