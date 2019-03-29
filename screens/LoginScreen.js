import React from 'react';
import { Button, AsyncStorage, Image, ScrollView, StyleSheet, Text, TouchableHighlight, View, } from 'react-native';
import { AppLoading, Asset, Font, Icon, LinearGradient } from 'expo';

import { TextInput } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions } from 'react-navigation';


import * as firebase from "firebase";  





const resetBackCreateAccount = StackActions.reset({
  index: 0, // <-- currect active route from actions array
  actions: [
    NavigationActions.navigate({ routeName: 'LoginScreen' }),
  ],
});



export default class LoginScreen extends React.Component {

  state = {
    email: '', password: '', user: {}, authenticationCode: '', showConfirmationForm: false,
  }

  forgotPassword () {
    alert("Coming soon in next patch!")
  }

    onLogin() {
        //alert('login')
      const { email, password } = this.state;
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
          // If you need to do anything with the user, do it here
          // The user will be logged in automatically by the 
          // `onAuthStateChanged` listener we set up in App.js earlier
          //alert('logged in')
          this.props.navigation.navigate('HomeScreen');
        })
        .catch((error) => {
          const { code, message } = error;
          console.log(error)
          alert(message)
          // For details of error codes, see the docs
          // The message contains the default Firebase string
          // representation of the error
        });
    }

    onRegister() {
      //alert('register')
      const { email, password } = this.state;
      this.props.navigation.navigate('createAccount');
      // firebase.auth().createUserWithEmailAndPassword(email, password)
      //   .then((user) => {
      //     // If you need to do anything with the user, do it here
      //     // The user will be logged in automatically by the
      //     // `onAuthStateChanged` listener we set up in App.js earlier
      //     alert('registered')
      //     this.props.navigation.navigate('createAccount');
      //   })
      //   .catch((error) => {
      //     const { code, message } = error;
      //     console.log(error)
      //     alert(message)
      //     // For details of error codes, see the docs
      //     // The message contains the default Firebase string
      //     // representation of the error
      //   });
    }


  onChangeText = (key, val) => {
    this.setState({ [key]: val })
    _logoutData = async () => {
      try {
        await AsyncStorage.setItem('Logout', 'no');
      } catch (error) {
        // Error saving data
      }
    }

    _logoutData();
  }


  componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.props.navigation.navigate('HomeScreen');
      }
      //alert(user.email)
    });
  }

  componentWillUnmount() {
    this.authSubscription();
  }

  render() {
    return (

      <View style={styles.container}>
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
              {/* <Image
                source={
                  __DEV__
                    ? require('../assets/images/logo.png')
                    : require('../assets/images/logo.png')
                }
                style={styles.welcomeImage}
              /> */}
              <Text style={styles.appName}>MealShare</Text>
            </View>

            <View style={styles.logInContainer}>
              <TextInput
              style={styles.logPassInput}
                  placeholder="Email"
                  onChangeText={val => {this.onChangeText('email', val)}}
              />

              <TextInput
                  style={styles.logPassInput}
                  placeholder="Password"
                  onChangeText={val => {this.onChangeText('password', val)}}
                  value={this.state.password}
                  secureTextEntry={true}
              />
            </View>

            <View style={styles.allButtonsContainer}>

              <TouchableHighlight
                style={ styles.logPassButton }
                onPress={this.onLogin.bind(this)}
              >
                <Text style={ styles.ButtonText }>LOG IN</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={ styles.logPassButton }
                onPress={this.onRegister.bind(this)}
              >
                <Text style={ styles.ButtonText }>SIGN UP</Text>
              </TouchableHighlight>

              <Text
                style={ styles.forgotPwdText }
                onPress={this.forgotPassword.bind(this)}
              >
              Forgot Password
              </Text>


            </View>
            </LinearGradient>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  appName: {
    fontSize: 40,
    color: '#6666FF',
  },
  logPassInput: {
    height: 40,
    width: 200,
    borderBottomColor: '#A594F9',
    borderBottomWidth: 2,
    marginBottom: 10,
    color: '#6666FF',
    fontSize: 15,
  },
  logPassButton: {
    width: 200,
    padding: 10,
    backgroundColor: '#6666FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 10,
  },
  ButtonText: {
    fontSize: 20,
    color: 'white',
  },
  forgotPwdBTN: {
    width: 200,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  forgotPwdText: {
    fontSize: 15,
    color: '#6666FF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  allButtonsContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    paddingHorizontal: 40
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  logInContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    paddingHorizontal: 40
  },
  logInText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
});
