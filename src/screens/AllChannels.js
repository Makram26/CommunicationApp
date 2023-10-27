import { FlatList, Text, View, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { getAllChannel } from '../services'


import AuthContext from '../Components/AuthProvider'

import PersonIcon from 'react-native-vector-icons/Fontisto'
import LogoutIcon from 'react-native-vector-icons/SimpleLineIcons'

import Spinner from 'react-native-loading-spinner-overlay'

import AsyncStorage from '@react-native-async-storage/async-storage';


const AllChannels = ({ navigation, ...props }) => {

    const [allChannel, setAllChannel] = useState([])
    const [chat, setChat] = useState([])
    const [isGroup, setIsGroup] = useState(false)
    const [username, setUserName] = useState("")
    const [loading, setLoading] = useState(false)
    const [partnerID,setPartnerID]=useState("")

    const [refreshing, setRefreshing] = useState(false); // Control for the refresh action

    const { setUser } = useContext(AuthContext)

    useEffect(() => {

        GetChannelData()

    }, [])


    const GetChannelData = async () => {
        // setLoading(true)
        const temp_partnerID = await AsyncStorage.getItem("partnerId")
        setPartnerID(temp_partnerID)


       

        const webURL = await AsyncStorage.getItem("URL")
        try {
            let tempchat = [], tempchannel = []

            const res = await getAllChannel(webURL)
            console.log(">>>>>>>>>>>>>>>>>>", res.result.channels[0].authorizedGroupFullName)
            for (let i = 0; i < res.result.channels.length; i++) {
                if (res.result.channels[i].authorizedGroupFullName != "User types / Internal User") {
                    tempchat.push(res.result.channels[i])

                }
                else {

                    tempchannel.push(res.result.channels[i])

                }
            }

            setChat(tempchat)
            setAllChannel(tempchannel)


            setUserName(await AsyncStorage.getItem('username'))



        } catch (error) {
            console.log("error", error)
        }

        // setLoading(false)
    }

    console.log(username)


    const RemoveSession = async () => {
        await AsyncStorage.removeItem("uid")
        await AsyncStorage.removeItem("username")
        await AsyncStorage.removeItem("email")
        await AsyncStorage.removeItem("URL")

        setUser(null)

    }



    const onLogout = async () => {
        try {
            Alert.alert(
                'Logout',
                'Do you want to Logout?',
                [
                    { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'Yes', onPress: () => RemoveSession() },
                ],
                {
                    cancelable: false,
                    textstyle: styles.alertText

                });
        } catch (err) {
            console.log(err)
        }
    }


    const handleRefresh = () => {
        setRefreshing(true);

        // Fetch new data or perform any other refresh action here
        // Once the refresh is complete, update the data source and set refreshing to false
        setTimeout(() => {
            GetChannelData()
            setRefreshing(false);
        }, 1000); // Simulating a delay, replace with your actual data fetching logic
    };



    console.log("partnerId >>>>>>>>>", partnerID)
    return (
        <View style={styles.mainContainer}>
            {/* {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            } */}
            <View style={styles.upperContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => onLogout()}>
                        <LogoutIcon name='logout' color={"#FFFFFF"} size={20} style={{ marginLeft: 12 }} />
                    </TouchableOpacity>
                </View>
                {
                    isGroup ?
                        <Text style={{ textAlign: "center", padding: 10, fontSize: 15, fontWeight: "700", color: "#71639E" }}>CHANNELS</Text>
                        :
                        <Text style={{ textAlign: "center", padding: 10, fontSize: 15, fontWeight: "700", color: "#71639E" }}>START A CONVERSATION</Text>
                }


                <FlatList
                    data={isGroup ? allChannel : chat}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => {


                        return (
                            <>
                                {
                                    item.name.slice(0, 7) != "OdooBot" ?
                                        <TouchableOpacity onPress={() => navigation.navigate("ChatScreen", {id:item.id,parterId:partnerID,name:isGroup ?
                                            item.name
                                            :
                                            item.name == username ? item.name : item.name.replace(new RegExp(username, 'i'), '').replace(/,\s*/, '').trim()})}>

                                            <View style={{ borderWidth: 0.5, borderColor: "#71639E", marginTop: 10 }} />
                                            <View style={styles.card}>
                                                <View style={{ flexDirection: "row", }}>
                                                    <View style={styles.box}>
                                                        <PersonIcon name='person' color={"#FFFFFF"} size={25} />
                                                    </View>
                                                    <View style={{ justifyContent: "center" }}>
                                                        <Text style={{ fontSize: 16, marginLeft: 13, fontWeight: "500", color: "#71639E" }}>
                                                            {isGroup ?
                                                                item.name
                                                                :
                                                                item.name == username ? item.name : item.name.replace(new RegExp(username, 'i'), '').replace(/,\s*/, '').trim()
                                                            }
                                                        </Text>

                                                    </View>

                                                </View>
                                                <View style={{ justifyContent: "center", marginRight: 20 }}>
                                                    <Text style={{ color: "#71639E", fontSize: 14, fontWeight: "400" }}>{item.last_interest_dt.slice(11, 16)}</Text>

                                                </View>


                                            </View>





                                        </TouchableOpacity>

                                        :
                                        null
                                }
                            </>
                        )
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                />


            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    onPress={() => setIsGroup(false)}
                    style={styles.b_mainContainer}
                >
                    <PersonIcon name='person' color={isGroup ? "#0f0f0f" : "#71639E"} size={20} />
                    <Text style={{ ...styles.tabTextStyle, color: isGroup ? "#0f0f0f" : "#71639E" }}>Chat</Text>

                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setIsGroup(true)}
                    style={styles.b_mainContainer}
                >
                    <PersonIcon name='persons' color={isGroup ? "#71639E" : "#0f0f0f"} size={20} />
                    <Text style={{ ...styles.tabTextStyle, color: isGroup ? "#71639E" : "#0f0f0f" }}>Channel</Text>
                </TouchableOpacity>
            </View>


        </View >
    )
}

export default AllChannels


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },
    upperContainer: {
        flex: 0.92,
        // backgroundColor: "red",
    },
    header: {
        width: "100%",
        height: "7%",
        backgroundColor: "#71639E",
        justifyContent: "center"
    },
    card: {
        width: "100%",
        marginTop: 10,
        marginLeft: 10,
        marginBottom: 5,
        justifyContent: 'space-between',
        flexDirection: "row"


    },
    box: {
        width: 50,
        height: 50,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#71639E"


    },
    bottomContainer: {
        flex: 0.08,
        borderWidth: 0.5,
        marginTop: 5,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    b_mainContainer: {
        flex: 1,
        borderRightWidth: 0.5,
        justifyContent: "center",
        alignItems: "center"
        // backgroundColor:"red"
    },
    tabTextStyle: {
        fontSize: 15,
        fontWeight: "600",

        padding: 5

        // 71639E
    }


})

