import React, { Component } from 'react';
import { StyleSheet, View, Platform, Alert, Image } from 'react-native';

//libaries
import { request, PERMISSIONS } from 'react-native-permissions';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import io from "socket.io-client";

//components
import SearchModal from './Modal/SearchModal/SearchModal';
import LocateMeButton from './LocateMeButton/LocateMeButton';
import BackButton from './BackButton/BackButton';
import Menu from './Menu/Menu';
import EventModal from './Modal/EventModal/EventModal';
import HostEventModal from './Modal/HostEventModal/HostEventModal';

//mapstyle json
import MapStyle from './MapStyle.json';

//marker
import JytteriLogo from '../../Images/JytteriLogo.png';


class Map extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchModalVisible: false,
      eventModalVisible: false,
      hostEventModalVisible: false,
      events: [],
    }
  }

  componentDidMount(){
    this.requestLocationPermission();
    this.setEventsOnMap();
    //const socket = io("http://localhost:5000");
  }

  navigateToProfile = () => {
    this.toggleEventModal(false);
    this.props.navigation.navigate("home");
  }


  //toggle search modal
  toggleSearchModal = (type) => {
    this.setState({searchModalVisible: type});
  }

  //toggle event modal
  toggleEventModal = (type, item) => {
    if(type){ //modal opened
      this.getEventUsers(item);
    }
    else{ //modal closed
      this.setState({eventModalVisible: type, currentEventItem: item});
    }
  }

  //open host event modal
  toggleHostEventModal = (visible) => {
    if(visible){
      this.setState({hostEventModalVisible: true});
    }
    else{
      this.setState({hostEventModalVisible: false});
    }
  }

  //focus on the marker when pressed
  onPressMarker(input){
    this.searchLocation(input);
  }

  //go back to main page in map
  goBack = () => {
    this.centerMyLocation();
    this.setState({myMarker: null});
  }

  //center your current location
  centerMyLocation = () => {
    const{ latitude, longitude, latitudeDelta, longitudeDelta } = this.state.myCurrentPosition;
    this.map.animateToRegion({
      latitude, longitude, latitudeDelta, longitudeDelta
    });
  }

  //check if permission is enabled
  requestLocationPermission = async() => {
    if(Platform.OS === "ios"){
      var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if(response === "granted"){
        this.locateCurrentPosition();
      }
    }
  }

  //calculate my current location
  locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        //console.log(JSON.stringify(position));
        const myCurrentPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }

        this.setState({ myCurrentPosition });
      },
      error => Alert.alert(error.message),
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    )
  }

  //set all the event markers on the map
  setEventsOnMap = () => {
    var request = new Request('http://localhost:5000/api/setEventsOnMap', {
      method: 'GET',
      headers: new Headers({ 'Content-Type' : 'application/json', 'Accept': 'application/json' })
    });
    fetch(request).then((response) => {
      response.json().then((data) => {
        this.setState({events: data});
      });
    }).catch(function(err){
      console.log(err);
    })
  }

  //edit event info
  editEventInfo = (item) => {
    let event = item; //user searched location position
    var request = new Request('http://localhost:5000/api/editEventInfo', {
      method: 'POST',
      headers: new Headers({ 'Content-Type' : 'application/json', 'Accept': 'application/json' }),
      body: JSON.stringify(event)
    });
    fetch(request).then((response) => {
      response.json().then((data) => {
        if(data.result){ //if data is successfully retrieved
          const myMarker =  JSON.parse(JSON.stringify(this.state.myMarker)); //my current marker
          for(const i in myMarker.events){ //update all the events with the same eventID
            if(myMarker.events[i].eventID === event.eventID){
              myMarker.events[i] = event;
            }
          }
          this.setState({myMarker : myMarker, currentEventItem: event});
        }
      });
    }).catch(function(err){
      console.log(err);
    });
  }

  //save event info when done hosting
  saveEventInfo = (eventName, startDate, endDate) => {
    let myMarker =  JSON.parse(JSON.stringify(this.state.myMarker));
    myMarker['eventName'] = eventName;
    myMarker['startDate'] = startDate;
    myMarker['endDate'] = endDate;
    let request = new Request('http://localhost:5000/api/storeEvent', {
      method: 'POST',
      headers: new Headers({ 'Content-Type' : 'application/json', 'Accept': 'application/json' }),
      body: JSON.stringify(myMarker)
    });
    fetch(request).then((response) => {
      response.json().then((data) => {
        let events = JSON.parse(JSON.stringify(this.state.events)); //all the events
        myMarker['events'] = data; // store all the data inside 
        events.push(myMarker);

        this.setState({myMarker: myMarker, events: events});
      });
    }).catch(function(err){
      console.log(err);
    });
  }

  //remove user form event
  leaveEvent = async(item) => {
    const info = {
      userID: await AsyncStorage.getItem('userID'), //userID
      eventID: this.state.currentEventItem.eventID //eventID
    };
    const request = new Request('http://localhost:5000/api/leaveEvent', {
      method: 'POST',
      headers: new Headers({ 'Content-Type' : 'application/json', 'Accept': 'application/json' }),
      body: JSON.stringify(info)
    });
    fetch(request).then((response) => {
      response.json().then((data) => {
        if(data.result){
          this.searchLocation(item); //refresh
        }
      });
    }).catch(function(err){
      console.log(err);
    });
  }

  deleteEvent = (item) => {
    const info = {
      eventID: this.state.currentEventItem.eventID //eventID
    };
    const request = new Request('http://localhost:5000/api/deleteEvent', {
      method: 'POST',
      headers: new Headers({ 'Content-Type' : 'application/json', 'Accept': 'application/json' }),
      body: JSON.stringify(info)
    });
    fetch(request).then((response) => {
      response.json().then((data) => {
        if(data.result){
          this.searchLocation(item); //refresh
        }
      });
    }).catch(function(err){
      console.log(err);
    });
  }

  //zoom in to the pressed location
  searchLocation = async(item) => {
    this.setState({myMarker: null});
  
    let location = {
      // search modal data or onPressMarker data
      locationID: item.place_id ? item.place_id : item.locationID,
      hostID: await AsyncStorage.getItem('userID'),
      locationName: item.name ? item.name : item.locationName,
      locationAddress: item.formatted_address ? item.formatted_address : item.locationAddress,
      latitude: item.geometry ? item.geometry.location.lat : item.latitude,
      longitude: item.geometry ? item.geometry.location.lng : item.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    };

    var request = new Request('http://localhost:5000/api/searchLocationEvents', {
      method: 'POST',
      headers: new Headers({ 'Content-Type' : 'application/json', 'Accept': 'application/json' }),
      body: JSON.stringify(location)
    });
    fetch(request).then((response) => {
      response.json().then(async (data) => {
        location['events'] = data //store received data inside the location json
        await this.map.animateToRegion(location, 1000); //zoom in for delta 2000ms
        this.setState({myMarker: location}); //set marker
      });
    }).catch(function(err){
      console.log(err);
    });
  }

  //join the selected event
  joinEvent = async (item) => {
    const info = {
      userID: await AsyncStorage.getItem('userID'), //userID
      eventID: item.eventID //eventID
    };
    var request = new Request('http://localhost:5000/api/joinEvent', {
      method: 'POST',
      headers: new Headers({ 'Content-Type' : 'application/json', 'Accept': 'application/json' }),
      body: JSON.stringify(info)
    });
    fetch(request).then((response) => {
      response.json().then((data) => {
        if(data.result){
          this.searchLocation(item); //refresh
        }
      });
    }).catch(function(err){
      console.log(err);
    });
  }

  //get event users
  getEventUsers = (item) => {
    const info = {
      eventID: item.eventID //eventID
    };
    var request = new Request('http://localhost:5000/api/getEventUsers', {
      method: 'POST',
      headers: new Headers({ 'Content-Type' : 'application/json', 'Accept': 'application/json' }),
      body: JSON.stringify(info)
    });
    fetch(request).then((response) => {
      response.json().then((data) => {
        const event =  JSON.parse(JSON.stringify(item)); //current clicked event data
        event['guests'] = data; //insert guests into event object
        this.setState({eventModalVisible: true, currentEventItem: event});
      });
    }).catch(function(err){
      console.log(err);
    });
  }

  render(){
    return(
      <View style = {styles.mapContainer}>
        <SearchModal
          modalState = {this.state.searchModalVisible}
          myCurrentPosition = {this.state.myCurrentPosition}
          toggleSearchModal = {this.toggleSearchModal}
          searchLocation = {this.searchLocation}/>
        <EventModal
          eventModalState = {this.state.eventModalVisible}
          currentEventItem = {this.state.currentEventItem}
          toggleEventModal = {this.toggleEventModal}
          editEventInfo = {this.editEventInfo}
          leaveEvent = {this.leaveEvent}
          deleteEvent = {this.deleteEvent}
          navigateToProfile = {this.navigateToProfile}
          />
        <HostEventModal
          visible = {this.state.hostEventModalVisible}
          toggleHostEventModal = {this.toggleHostEventModal}
          saveEventInfo = {this.saveEventInfo}
        />
        <MapView 
          style = {styles.mapView}
          ref={(map) => {this.map = map}}
          showsUserLocation={true}
          provider = {PROVIDER_GOOGLE}
          customMapStyle={MapStyle}
          initialRegion = {this.state.myCurrentPosition}>

          {this.state.myMarker && //user searched marker
            <Marker
              key={this.state.myMarker.eventID}
              coordinate={{latitude: this.state.myMarker.latitude, longitude: this.state.myMarker.longitude}}
              onPress={this.onPressMarker.bind(this, this.state.myMarker)}
              //pinColor = {"#000000"}
              zIndex = {1}>
            </Marker>
          }
          {this.state.events.map((event) => { //all the events marker
            return(
              <Marker
                key = {event.eventID}
                coordinate={{longitude: event.longitude, latitude: event.latitude}}
                onPress = {this.onPressMarker.bind(this, event)}
                pinColor = {"#123456"}>
                  {!(this.state.myMarker && this.state.myMarker.latitude === event.latitude && this.state.myMarker.longitude === event.longitude) &&
                  <Image
                    source = {JytteriLogo}
                    style = {[styles.eventMarker,event.startDate >= new Date() &&{opacity: 0.5} ]}/>}
              </Marker>
            )
          })}
        </MapView>
        <LocateMeButton 
          centerMyLocation = {this.centerMyLocation}/>
        {this.state.myMarker  &&
          <BackButton
            goBack = {this.goBack}/>}
        <Menu 
          toggleSearchModal = {this.toggleSearchModal}
          myMarker = {this.state.myMarker}
          toggleEventModal = {this.toggleEventModal}
          toggleHostEventModal = {this.toggleHostEventModal}
          joinEvent = {this.joinEvent}
          searchLocation = {this.searchLocation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapContainer:{
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
  eventMarker:{
    width: 25,
    height: 25,
  },
  myMarker:{
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#F9A908",
  }
});

export default Map;