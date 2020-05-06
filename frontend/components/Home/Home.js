import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

//packages
import AsyncStorage from '@react-native-community/async-storage';

//components
import Header from './Header/Header';
import UserInfo from './UserInfo/UserInfo';
import UserEventInfo from './UserEventInfo/UserEventInfo';

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }

    componentDidMount(){
        this.getUserInfo();
    }

    //logout
    onPressLogout = async() => {
        try{
            await AsyncStorage.clear(); //clear my id in asyncstorage
            await this.props.navigation.navigate("authentication"); //navigate to authenitcation page
        }
        catch (err){
        console.log(err);
        }
    }

    getUserInfo = async () => {
        const info = {
            userID: await AsyncStorage.getItem('userID')
        };
        var request = new Request('http://localhost:5000/api/getUserInfo', {
            method: 'POST',
            headers: new Headers({ 'Content-Type' : 'application/json', 'Accept': 'application/json' }),
            body: JSON.stringify(info)
        });
        fetch(request).then((response) => {
            response.json().then((data) => {
                this.setState({userInfo: data[0]})
            });
        }).catch(function(err){
            console.log(err);
        });
    }

    render(){
        return(
            <View style ={styles.homeView}>
                <Header
                    userInfo={this.state.userInfo}/>
                <UserInfo
                    userInfo = {this.state.userInfo}/>
                <UserEventInfo
                    userInfo = {this.state.userInfo}/>
                <TouchableOpacity style = {styles.logoutBtn} onPress = {this.onPressLogout}>
                    <Text style = {styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    homeView:{
        flex: 1,
        backgroundColor: "white",
    },
    title: {
        fontSize: 40
    },
    logoutBtn:{
        margin: 10,
        padding: 10,
        alignItems: 'center',
        backgroundColor: "#3C3C3D",
        borderRadius: 10,
    },
    logoutText:{
        color: "white",
        fontSize: 15,
        fontFamily: 'Helvetica Neue',
    }
});

export default Home;