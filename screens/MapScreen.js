import React from 'react';
import { Button, AsyncStorage, Image, ScrollView, StyleSheet, Text, TouchableHighlight, View, } from 'react-native';
import { AppLoading, Asset, Font, Icon, LinearGradient } from 'expo';

import { TextInput } from 'react-native-gesture-handler';
import { MonoText } from '../components/StyledText';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions } from 'react-navigation';


import * as firebase from "firebase";  
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';


var markers = [
    {
      latitude: 42.2808256,
      longitude: -83.7430378,
      title: 'Foo Place',
      subtitle: '1234 Foo Drive'
    }
  ];

export default class MapScreen extends React.Component {
    
    state = {
        locationCoordinates: {
            latitude: 42.2808256,
            latitudeDelta: 0.0922,
            longitude:  -83.7430378,
            longitudeDelta: 0.0421,
          },
      
          markers: [{
              title: 'hello',
              description: 'sdfsd',
              coordinates: {
                latitude: 42.2658,
                longitude: -83.7487
              },
            },
            {
              title: 'helloo',
              coordinates: {
                latitude: 42.2808256,
                longitude: -83.743
              },  
            }]
      };


    constructor(props) {
        super(props);
        var lat = 0;
        var long = 0;

        
        this.handleLocationChange = this.handleLocationChange.bind(this);
    }
      
    
      handleLocationChange(response){
        this.setState({
          locationCoordinate: response
        })
      }

    //   componentDidMount() {
    //     navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //           console.log("wokeeey");
    //           console.log(position);
    //           this.state.locationCoordinates.latitude = position.coords.latitude
              
    //           this.setState({
    //             latitude: position.coords.latitude,
    //             longitude: position.coords.longitude,
    //             error: null,
    //           });
    //         },
    //         (error) => this.setState({ error: error.message }),
    //         { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    //       );
    //    }


    render() {
        return (
            <View>
                <Text>Fuk</Text>
                <MapView
                    provider={ PROVIDER_GOOGLE }
                    style={ styles.overallViewContainer }
                    region={{ latitude: 42.2808256,
                        latitudeDelta: 0.0922,
                        longitude:  -83.7430378,
                        longitudeDelta: 0.0421, }}
                    //onRegionChange={ this.handleLocationChange }
                    zoomEnabled={true}
                    scrollEnabled={true}
                    showsUserLocation={true}
                    zoomEnabled={true}
                    scrollEnabled={true}
                    //annotations={this.markers}
                    >
                    {this.state.markers.map((marker, index) => (
                        <MapView.Marker 
                        key={index}
                        coordinate={marker.coordinates}
                        title={marker.title}
                        />
                    ))}
                    
                </MapView>
    
            </View>
        )
    
    }
    

}

const styles = StyleSheet.create({
    overallViewContainer: {
        height: '100%',
        width: '100%',
      },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      },

})