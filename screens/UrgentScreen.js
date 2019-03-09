import React from 'react';
import { Button, StyleSheet, Text, TouchableHighlight, View, AsyncStorage} from 'react-native';
import { MonoText } from '../components/StyledText';
import { TextInput } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Auth, API } from 'aws-amplify';
import axios from 'axios';
import ElevatedView from 'react-native-elevated-view'

export default class UrgentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      address: '',
      locationName: '',
      locationCoordinates: {
          latitude: 42.2808256,
          latitudeDelta: 0.0922,
          longitude:  -83.7430378,
          longitudeDelta: 0.0421,
        }
    };

    // Setting the user
    Auth.currentUserInfo().then((userInfo) => {
      this.setState(previousState => (
        { username: userInfo.username }))
    })

    this.handleLocationChange = this.handleLocationChange.bind(this);
  }

  handleSubmit(response) {
    var locationCoord = response.geometry.location;
    this.setState(previousState => ({
      address: response.formatted_address,
      locationName: response.name,
      locationCoordinates: {
        latitude: locationCoord.lat,
        latitudeDelta: 0.0922,
        longitude: locationCoord.lng,
        longitudeDelta: 0.0421,
      },
    }))
    console.log(this.state);
  }

  handleLocationChange(response){
    this.setState({
      locationCoordinate: response
    })
  }


  // API Handling here
  saveLocation() {
    let apiName = 'SafeNightAPI';
    let path = '/location/set';

    let myInit = {
        body: {
          "username": this.state.username,
          "st_address": this.state.address,
          "location": this.state.locationName,
          "longitude": this.state.locationCoordinates.longitude,
          "latitude": this.state.locationCoordinates.latitude
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

      _setLocation = async () => {
        try {
          await AsyncStorage.setItem('LocationData', this.state.locationName);
        } catch (error) {
          // Error saving data
          console.log('ERROR SAVING LOCATION ', error)
        }
    }

    _setLocation();

      //console.log("THIS IS THE LOCATION WE WANNA SAVE " + this.state.locationName)

      this.props.navigation.navigate('urgentLock', {
        locationName: this.state.locationName,
      });

  }

  render() {
    return (
      <View style={ styles.overallViewContainer }>
        <MapView
          provider={ PROVIDER_GOOGLE }
          style={ styles.container }
          region={ this.state.locationCoordinates }
          onRegionChange={ this.handleLocationChange }
          zoomEnabled={true}
          scrollEnabled={true}
        >
          <MapView.Marker
            coordinate={{
              latitude: this.state.locationCoordinates.latitude,
              longitude: this.state.locationCoordinates.longitude,
            }}
          />
        </MapView>
        <View style={styles.allNonMapThings}>
          <View style={styles.inputContainer}>
            <GooglePlacesAutocomplete
              placeholder='Search'
              minLength={2}             // minimum length of text to search
              autoFocus={true}
              returnKeyType={'search'}  // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              listViewDisplayed='auto'  // true/false/undefined
              fetchDetails={true}       // 'details' is provided when fetchDetails = true
              renderDescription={row => row.description} // custom description render
              onPress={(data, details = null) => { this.handleSubmit(details) }}
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: 'AIzaSyDOA5QVFT5HWHWP-zUF83IOHdjhkf2Y9Sk',
                language: 'en', // language of the results
              }}
              styles={{
                textInputContainer: {
                  width: '100%'
                },
                description: {
                  fontWeight: 'bold'
                },
                predefinedPlacesDescription: {
                  color: '#1faadb'
                }
              }}
              // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
              nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
              GooglePlacesSearchQuery={{            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                rankby: 'distance',
                types: 'food'
              }}
              filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
              debounce={200}                       // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
            />

            <TouchableHighlight
              style={ styles.saveLocationBTN }
              onPress={() => { this.saveLocation(); }}
              >
              <Text style={ styles.saveLocationBTNtext }>Save Location</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
        );
    }
}

const styles = StyleSheet.create({
  saveLocationBTN: {
    width: '100%',
    padding: 10,
    backgroundColor: '#6666FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveLocationBTNtext: {
    fontSize: 20,
    color: 'white',
  },
  overallViewContainer: {
    //position: 'absolute',
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
  input: {
    elevation: 1,
    width: '99%',
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  allNonMapThings: {
    elevation: 1,
    alignItems: 'center',
    height: '400%',
    width: '100%',
    top: 10,
  },
  inputContainer: {
    elevation: 1,
    backgroundColor: 'white',
    width: '90%',
    height: '6%',
    top: '1%',
    borderRadius: 3,
    shadowOpacity: 0.75,
    shadowRadius: 1,
    shadowColor: 'gray',
    shadowOffset: { height: 0, width: 0}
  },
  button: {
    elevation: 1,
    position: 'absolute',
    bottom: 25,
    backgroundColor: '#ff6600',
    borderRadius: 10,
    width: '60%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.75,
    shadowRadius: 1,
    shadowColor: 'gray',
    shadowOffset: { height: 0, width: 0}
  },
});
