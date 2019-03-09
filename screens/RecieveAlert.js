import React, { Component } from 'react';
import { Alert, AppRegistry, Platform, StyleSheet, Text, TextInput, Image, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, View } from 'react-native';

export default class RecieveAlert extends Component {
  _onPressButton() {
    Alert.alert('You are on your way to helping')
  }

  constructor(props) {
    super(props);
    this.state = {text: ''};
  }

  render() {

    let pic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Male_gorilla_in_SF_zoo.jpg/220px-Male_gorilla_in_SF_zoo.jpg'
    };

    return (



      <View style={{
        flex: 1,
        flexDirection: 'column'
        }}>

      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
           
          <TouchableOpacity onPress={() => this.props.navigation.navigate('UrgentScreen')} underlayColor="white">
            <View style={{width: 50, height: 50, backgroundColor: 'red'}}>
              <Text style={{padding: 15, fontSize: 25}}>X</Text>
            </View>
          </TouchableOpacity>


          <TouchableOpacity onPress={this._onPressButton} underlayColor="blue">
            <View style={styles.button}>
              <Text style={styles.buttonText}>Accept Alert</Text>
            </View>
          </TouchableOpacity>

      </View>




      <View style={{padding: 10, alignItems: 'center'}}>
      <Image source={pic} style={{width: 250, height: 200}}/>
      <Text> Mr Goriila Mcandy </Text>
      </View>

      
      <View style={{flex: 6, padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Type here to Chat!"
          onChangeText={(text) => this.setState({text})}
        />
      </View>

      </View>
      

      


    );
        

  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center'
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    backgroundColor: 'green'
  },
  buttonText: {
    padding: 10,
    color: 'white',
    fontSize: 18
  }

});