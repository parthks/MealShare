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

    static navigationOptions = ({navigation, screenProps }) => ({
        title: 'Please select a shop',
      });

    
    state = {
        locationCoordinates: {
            latitude: 42.2808256,
            latitudeDelta: 0.07222,
            longitude:  -83.7430378,
            longitudeDelta: 0.0221,
          },
      
          markers: [
            // {
            //   title: "Rohan's Popcorn",
            //   description: 'sdfsd',
            //   coordinates: {
            //     latitude: 42.2658,
            //     longitude: -83.7487
            //   },
            // },
            {
              title: "Bri's Muffin Shop",
              description: "Delicous Muffins",
              coordinates: {
                latitude: 42.283737,
                longitude: -83.742065
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
            
                    {/* <TouchableHighlight
                    style={styles.logPassButton}
                    onPress={() => {alert("BUTTON PRESSED"); this.props.navigation.navigate("foodList")}}
                     >
              
                <Text style={styles.buttonText}> SEE ALL DISHES</Text>
                </TouchableHighlight> */}
            

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
                        // title={marker.title}
                        onPress={e => {this.props.navigation.navigate("foodList", {
                            id: e._targetInst.return.key});}
                        }
                        // description={marker.description}
                        >

                        <Text style={styles.customView}>{marker.title}</Text>
                       
                            {/* <MapView.Callout tooltip>
                                <TouchableHighlight onPress={() => {alert("BUTTON PRESSED"); this.props.navigation.navigate("foodList")}}>
                                    <View style={styles.customView}> 
                                        <Text>{marker.title}</Text>
                                    </View>
                                </TouchableHighlight>
                            </MapView.Callout> */}
                        </MapView.Marker>
                    ))}
                
                
                    
                </MapView>

                
    
            </View>
        )
    
    }
    

}

const styles = StyleSheet.create({

    customView: {
        backgroundColor: 'white',
        padding: 5
    },
    
    bubble: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
        marginRight: 20,
      },
      button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 20,
        zIndex: 10,
      },
      buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
        top: '80%',
        zIndex: 10,
        
      },
    buttonText: {
        justifyContent: 'center',
        alignItems: 'center',
        color: "white"
        //left: '25%'
    },

    overallViewContainer: {
        height: '100%',
        width: '100%',
        //zIndex: -1
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

    logPassButton: {
        width: '100%',
        height: 40,
        padding: 10,
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


})