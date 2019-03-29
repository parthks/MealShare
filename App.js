import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import {createStackNavigator, createAppContainer} from 'react-navigation'

import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import createAccount from './screens/createAccount'
import MapScreen from './screens/MapScreen'
import foodList from './screens/foodList'
import MessagingScreen from './screens/MessagingScreen'
import * as firebase from "firebase";  



const config = {  
  apiKey: "AIzaSyBRXCuY9SBKMcEnpyNxA0sm8P0cMFVSGF8",
  authDomain: "mealshare-a45fd.firebaseapp.com",
  databaseURL: "https://mealshare-a45fd.firebaseio.com",
  projectId: "mealshare-a45fd",
  storageBucket: "mealshare-a45fd.appspot.com",
  messagingSenderId: "996722584901"  
};  

firebase.initializeApp(config);







const AppStackNavigator = createStackNavigator({
MapScreen: MapScreen,
LoginScreen: LoginScreen,
HomeScreen: HomeScreen,
createAccount: createAccount,
foodList: foodList,
MessagingScreen: MessagingScreen

},
{
    initialRouteName: "LoginScreen"
});


export default class App extends React.Component {
  async componentDidMount() {
    await Font.loadAsync({
      'roboto-condensed-regular': require('./assets/fonts/Roboto_Condensed/RobotoCondensed-Regular.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  render() {
        const Rootnavigator = createAppContainer(AppStackNavigator);
        return <Rootnavigator/>

    }
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
