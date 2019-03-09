import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import {createStackNavigator} from 'react-navigation'

import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import createAccount from './screens/createAccount'


export default class App extends React.Component {
  async componentDidMount() {
    await Font.loadAsync({
      'roboto-condensed-regular': require('./assets/fonts/Roboto_Condensed/RobotoCondensed-Regular.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  render() {

        return <AppStackNavigator/>

    }
  }



const AppStackNavigator = createStackNavigator({
LoginScreen: LoginScreen,
HomeScreen: HomeScreen,
createAccount: createAccount,
},
{
    initialRouteName: "LoginScreen"
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
