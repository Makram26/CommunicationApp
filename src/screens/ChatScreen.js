import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, BackHandler, Text, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import SendIcon from 'react-native-vector-icons/Ionicons';
import HTML from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllMeassage, usersendMessage } from '../services';

import BackIcon from 'react-native-vector-icons/AntDesign'

const contentWidth = Dimensions.get('window').width;

const ChatScreen = ({ navigation, ...props }) => {
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);
    const scrollViewRef = useRef(null);
    const [isTyping, setIsTyping] = useState("")
    const ws = useRef(null);









    const connectWebSocket = async () => {


        const webURL = await AsyncStorage.getItem("URL")


        console.log(`ws:${webURL.slice(6)}/websocket`)

        ws.current = new WebSocket(`ws:${webURL.slice(6)}/websocket`);

        ws.current.onopen = () => {
            // console.log('WebSocket connection established.');
            ws.current.send(JSON.stringify({ "event_name": "subscribe", "data": { "channels": [], "last": 0 } }));
        };

        ws.current.onmessage = (event) => {
            console.log(event)

            const parsedData = JSON.parse(event.data);

            setIsTyping(parsedData[0].message.payload.isTyping)

            console.log("All record >>>>>>>>>>", parsedData[0].message.type)
            // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>", parsedData[0].message.payload.isTyping)


            // const dataString = parsedData.data;


            // const innerData = JSON.parse(dataString);
            // console.log('Received message:', (parsedData[0].message.payload.message.id));
            if (parsedData[0].message.type == "mail.channel/last_interest_dt_changed" && props.route.params.id != "1") {
                console.log("single user communication ")




                if (parsedData[1].message.payload.isTyping == undefined && parsedData[0].message.payload.id == props.route.params.id) {
                    const newMessage = {
                        // id:23
                        id: parsedData[1].message.payload.message.id,
                        username: parsedData[1].message.payload.message.author.name,
                        partner_id: parsedData[1].message.payload.message.author.id,
                        message: parsedData[1].message.payload.message.body,
                        time: (parsedData[1].message.payload.message.date).slice(11, 16)
                    }
                    setReceivedMessages((prevMessage) => [...prevMessage, newMessage])
                }
            }

            if (parsedData[0].message.type == "mail.channel/new_message") {
                console.log("group wise communication ")


                if (parsedData[0].message.payload.isTyping == undefined && parsedData[0].message.payload.id == props.route.params.id) {
                    const newMessage = {
                        // id:23
                        id: parsedData[0].message.payload.message.id,
                        username: parsedData[0].message.payload.message.author.name,
                        partner_id: parsedData[0].message.payload.message.author.id,
                        message: parsedData[0].message.payload.message.body,
                        time: (parsedData[0].message.payload.message.date).slice(11, 16)
                    }
                    setReceivedMessages((prevMessage) => [...prevMessage, newMessage])
                }
            }

            scrollToBottom()

            // if (scrollViewRef.current) {
            //   scrollViewRef.current.scrollToEnd({ animated: true });
            // }

        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);


            // setTimeout(connectWebSocket, 10000); // Retry after 10 seconds
        };

        return ws.current;
    }



    const sendMessage = async () => {
        // Send your message and handle it accordingly
        const webURL = await AsyncStorage.getItem("URL")

        setMessage("")
        // scrollViewRef.current.focus()
        const res = await usersendMessage(props.route.params.id, message, webURL)
    };

    const handleBackButton = () => {
        // Handle back navigation and cleanup
        setReceivedMessages([]);
        ws.current.close(); // Close the WebSocket connection
        navigation.goBack();
        return true;
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);




    useEffect(() => {


        // Open the WebSocket connection when the component is mounted
        ws.current = connectWebSocket();
        GetOldMessages()

        return () => {
            // Close the WebSocket connection when the component unmounts
            ws.current.close();
        };
    }, []);



    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };

    const GetOldMessages = async () => {
        try {


            const webURL = await AsyncStorage.getItem("URL")
            const res = await getAllMeassage(webURL, props.route.params.id, 2)

            console.log("all old messages >>>>>>>.", res)


            for (let i = res.result.length - 1; i >= 0; i--) {
                const OldMessage = {
                    // id:23
                    id: res.result[i].id,
                    username: res.result[i].author.name,
                    partner_id: res.result[i].author.id,
                    message: res.result[i].body,
                    time: (res.result[i].date).slice(11, 16)
                }


                setReceivedMessages((prevMessage) => [...prevMessage, OldMessage])
            }


        } catch (error) {
            console.log("error ", error)
        }




    }



    console.log(">...........................................................................................................", isTyping)



    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View style={{
                width: "100%",
                height: "7%",
                backgroundColor: "#71639E",
                // alignItems:"center",
                justifyContent: "center",

            }}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <BackIcon name='arrowleft' color={"#FFFFFF"} size={25} style={{ marginLeft: 12 }} />
                    </TouchableOpacity>
                    <View>
                        <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "700", marginLeft: 10 }}>{props.route.params.name}</Text>
                        <Text style={{ color: "#FFFFFF", marginLeft: 10, fontSize: 10 }}>{isTyping ? "Typing......." : ""}</Text>
                    </View>
                </View>


            </View>
            <ScrollView
                style={{ flex: 0.9 }}
                ref={scrollViewRef}
                onContentSizeChange={scrollToBottom} // Scroll to the bottom when content changes
                keyboardShouldPersistTaps="always"
            >
                {receivedMessages && receivedMessages.map((item, index) => (
                    <View key={index}
                        style={{
                            paddingHorizontal: 16,
                            backgroundColor: item.partner_id == props.route.params.parterId ? "#D9FDD3" : "#FFFFFF",
                            width: "75%",
                            alignSelf: item.partner_id == props.route.params.parterId ? "flex-end" : "flex-start",
                            margin: 10,
                            borderRadius: 20,
                            elevation: 10
                        }}>


                        <Text style={{ fontWeight: 'bold', marginTop: 5 }}>{item.username}</Text>


                        <HTML source={{ html: item.message }} contentWidth={contentWidth} />
                        <Text style={{ textAlign: "right", marginBottom: 5 }}>{item.time}</Text>



                    </View>
                ))}
            </ScrollView>
            <View style={{ flexDirection: "row", width: "100%", alignItems: "center", margin: 10, marginBottom: 0 }}>
                <View style={{ width: "83%", borderRadius: 100, backgroundColor: "#FFFFFF", elevation: 10, marginBottom: 5 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TextInput
                            style={{ paddingLeft: 10, alignItems: "center", width: message == "" ? "75%" : "85%" }}
                            placeholder="Message "
                            value={message}
                            autoCorrect={false}
                            onChangeText={(val) => setMessage(val)}
                        />
                        <Icon name="link" size={25} color="#000000" style={{ marginLeft: 10 }} />
                        {message == "" && (
                            <TouchableOpacity >
                                <Icon name="camera" size={25} color="#000000" style={{ marginLeft: 10 }} />
                            </TouchableOpacity>
                        )
                        }
                    </View>

                </View>
                <View style={{ alignItems: "center", backgroundColor: "green", borderRadius: 48 / 2, height: 48, width: 48, margin: 5, justifyContent: "center", marginRight: 10 }}>
                    {message == "" ?
                        <Icon name="mic" size={20} color="#FFFFFF" />
                        :
                        <TouchableOpacity onPress={() =>
                            sendMessage()
                        }>
                            <SendIcon name="send" size={23} color="#FFFFFF" />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </View>
    );
};

export default ChatScreen;
