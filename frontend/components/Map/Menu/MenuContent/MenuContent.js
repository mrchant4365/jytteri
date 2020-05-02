import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, FlatList } from 'react-native';

//packages

import FontAwesome from 'react-native-vector-icons/FontAwesome';

class MenuContent extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }

    //open event modal
    onPressOpenEventModal = (item) => {
        this.props.openEventModal(item);
    }

    //confirmation alert
    onPressHostEventAlert = () =>{
        Alert.alert("Confirm to host?","Your previous hosted events will get deleted",
          [{
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK", onPress: () => this.onPressHostEvent() }],
        );
    }

    //if host button clicked
    onPressHostEvent(){
        this.props.storeLocation();
    }

    renderEvents = ({item}) => {
        return(
        <TouchableOpacity style = {styles.eventView} onPress = {this.onPressOpenEventModal.bind(this, item)}>
            <View style = {styles.eventTitleView}>
                <View>
                    <Text style = {styles.eventTitleText} numberOfLines={1}>{item.eventName}</Text>
                </View>
                <View>
                    <Text style = {styles.eventAddressText} numberOfLines={2}>{item.locationAddress}</Text>
                </View>
            </View>
            <View style = {styles.eventPopulationView}>
                <View style = {styles.eventPopulationIconView}>
                    <FontAwesome name="user-o" size={20} color="grey"/>
                </View>
                <View style = {styles.eventPopulationCountView}>
                    <Text style = {styles.eventPopulationCountText}>5</Text>
                </View>
            </View>
            <TouchableOpacity style = {styles.eventJoinButtonView}>
                <Text style= {styles.eventJoinButtonText}> JOIN </Text>
            </TouchableOpacity>
        </TouchableOpacity>)
    }

    render(){
        return(
            <View style = {styles.bottomView}>
                <FlatList
                    data = {this.props.myMarker.events}
                    renderItem = {this.renderEvents}
                    keyExtractor = {(item)=>item.eventID.toString()}/>
                <TouchableOpacity style = {styles.addLocationButtonView} onPress = {this.onPressHostEventAlert}>
                    <Text style = {styles.addLocationButtonText}>Host</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    bottomView:{
        flex: 1,
        justifyContent: 'flex-end',
    },
    addLocationButtonView:{
        width: "100%",
        alignItems: 'center',
        backgroundColor: "#3C3C3D",
        margin: 5,
        padding: 10,
        borderRadius: 10,
    },
    addLocationButtonText:{
        color: "white",
        fontSize: 15,
        fontFamily: 'Helvetica Neue',
    },
    eventView:{
        margin: 5,
        padding: 5,
        borderBottomWidth: 0.5,
        borderBottomColor: "grey",
        flexDirection: "row",
    },
    eventTitleView:{
        flex: 1,
    },
    eventTitleText:{
        fontSize: 20,
        fontWeight: "200",
        fontFamily: 'Helvetica Neue',
        color: "#3C3C3D",
    },
    eventAddressText:{
        fontSize: 10,
        fontWeight: "300",
        fontFamily: 'Helvetica Neue',
        color: "#3C3C3D",
    },
    eventPopulationView:{
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
    },
    eventPopulationIconView:{
        flex: 1,
        alignItems: 'flex-end',
        padding: 5,
    },
    eventPopulationCountView:{
        flex: 1,
    },
    eventPopulationCountText:{
        fontSize: 20,
        fontWeight: "300",
        fontFamily: 'Helvetica Neue',
        color: "#3C3C3D",
    },
    eventJoinButtonView:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    eventJoinButtonText:{
        fontSize: 20,
        fontFamily: 'Helvetica Neue',
        color: "#3C3C3D",
    }
});

export default MenuContent;