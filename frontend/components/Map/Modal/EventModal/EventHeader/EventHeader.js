import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

//components
import CloseModalButton from '../../ModalComponents/CloseModalButton/CloseModalButton';

//packages
import AsyncStorage from '@react-native-community/async-storage';

class EventHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }

    async componentDidMount(){
        this.setState({myEventState: this.props.hostID === Number(await AsyncStorage.getItem('userID'))});
    }


    render(){
        return(
            <View style = {styles.eventModalHeaderView}>
                <View style = {{flex: 1,}}>
                    <CloseModalButton 
                        closeModal={this.props.closeEventModal}/>
                </View>
                <View style = {styles.eventTitleView}>
                    <Text style = {styles.eventTitleText}>Event</Text>
                </View>
                {this.state.myEventState ?
                <TouchableOpacity style = {styles.eventSaveView} onPress = {this.props.editEventToggle}>
                    <Text style = {styles.eventEditText}>Edit</Text>
                </TouchableOpacity> :
                <View style = {styles.eventSaveView}>
                </View>}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    eventModalHeaderView: {
        padding: 10,
        paddingTop: 50,
        flexDirection: 'row',
        backgroundColor: "#F9A908",
    },
    eventTitleView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventTitleText: {
        fontSize: 20,
        fontWeight: "500",
        fontFamily: 'Helvetica Neue',
        color: "white",
    },
    eventSaveView: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    eventEditText: {
        fontSize: 17,
        color: "white",
        fontWeight: "500",
    }
});

export default EventHeader;