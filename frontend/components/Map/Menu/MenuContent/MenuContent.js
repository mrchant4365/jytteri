import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList } from 'react-native';

//packages
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//icon
import JytteriLogo from '../../../../Images/JytteriLogo.png';

class MenuContent extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }
    async componentDidMount (){
        this.setState({userID: await AsyncStorage.getItem('userID')});
    }

    //open event modal
    onPressOpenEventModal = (item) => {
        this.props.openEventModal(item);
    }

    //if host button clicked
    onPressHostEvent = () => {
        this.props.openHostEventModal();
    }

    //join 
    onPressJoin(item){
        this.props.joinEvent(item)
    }

    renderEvents = ({item}) => {
        return(
        <TouchableOpacity style = {styles.eventView} onPress = {this.onPressOpenEventModal.bind(this, item)}>
            <View style = {styles.conditionView}>
                <Image
                    source = {JytteriLogo}
                    style = {[styles.logo, (item.startDate - new Date()) >=0 && {opacity: 0.5}]}/>
            </View>
            <View style = {styles.eventTitleView}>
                <View>
                    <Text style = {styles.eventTitleText} numberOfLines={1}>{item.eventName}</Text>
                </View>
                <View style ={{flexDirection: "row"}}>
                    <Text style = {styles.eventHostNameHeaderText}> Hosted by </Text>
                    <Text style = {styles.eventHostNameText} numberOfLines={2}>{item.hostName}</Text>
                </View>
            </View>
            <View style = {styles.eventPopulationView}>
                <View style = {styles.eventPopulationIconView}>
                    <FontAwesome name="user-o" size={20} color="#3C3C3D"/>
                </View>
                <View style = {styles.eventPopulationCountView}>
                    <Text style = {styles.eventPopulationCountText}>{item.guestCount ? item.guestCount : 0}</Text>
                </View>
            </View>
            {(Number(this.state.userID) !== item.hostID && item.status === 0) ?
            <TouchableOpacity style = {styles.eventJoinButtonView} onPress = {this.onPressJoin.bind(this, item)}>
                <Text style= {styles.eventJoinButtonText}> JOIN </Text>
            </TouchableOpacity> :  <View style= {styles.eventJoinButtonView}></View>}
        </TouchableOpacity>)
    }

    render(){
        return(
            <View style = {styles.bottomView}>
                <View style = {styles.addressView}>
                    <View style = {styles.addressViews}>
                        <Text style = {styles.addressText}>{this.props.myMarker.locationAddress}</Text>
                    </View>
                </View>
                {this.props.myMarker.events.length ?
                <FlatList
                    data = {this.props.myMarker.events}
                    renderItem = {this.renderEvents}
                    keyExtractor = {(item)=>item.eventID.toString()}/>:
                <View style ={styles.empyDataView}>
                    <Text style = {styles.emptyDataText}>No events at this location</Text>
                </View>}
                <TouchableOpacity style = {styles.addLocationButtonView} onPress = {this.onPressHostEvent}>
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
    addressView: {
        alignItems: "center",

    },
    addressViews:{
        alignItems: "center",
        backgroundColor: "#C3C3CD",
        borderRadius: 10,
        padding: 5,
        opacity: 0.7,
        marginTop: 15,
    },
    addressText: {
        color: "white",
    },
    eventView:{
        margin: 5,
        padding: 5,
        flexDirection: "row",
    },
    conditionView:{
        width: 35,
        justifyContent: "center",
    },
    logo: {
        resizeMode:'contain',
        width: 25,
        height: 25,
    },
    eventTitleView:{
        flex: 1,
    },
    eventTitleText:{
        fontSize: 20,
        fontFamily: 'Helvetica Neue',
        color: "#3C3C3D",
    },
    eventHostNameHeaderText:{
        fontSize: 10,
        fontWeight: "300",
        fontFamily: 'Helvetica Neue',
        color: "#3C3C3D",
    },
    eventHostNameText: {
        fontSize: 10,
        fontWeight: "500",
        fontFamily: 'Helvetica Neue',
        color: "#3C3C3D",
    },
    eventPopulationView:{
        width: 50,
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
        fontFamily: 'Helvetica Neue',
        color: "#3C3C3D",
    },
    eventJoinButtonView:{
        width: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventJoinButtonText:{
        fontSize: 20,
        fontFamily: 'Helvetica Neue',
        fontWeight: "500",
        color: "#F9A908",
    },
    empyDataView:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyDataText:{
        fontSize: 20,
        fontWeight: "300",
        fontFamily: 'Helvetica Neue',
        color: "#3C3C3D",
    },
    addLocationButtonView:{
        width: "100%",
        alignItems: 'center',
        backgroundColor: "#F9A908",
        margin: 5,
        padding: 5,
        borderRadius: 10,
    },
    addLocationButtonText:{
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: 'Helvetica Neue',
    },
});

export default MenuContent;