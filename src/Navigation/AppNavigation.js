import React from "react";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native'
import ChatScreen from "../screens/ChatScreen";
import AllChannels from "../screens/AllChannels";


const Stack = createStackNavigator();
const screenOptionStyle = {
    headerShown:false,
    headerStyle: {
        backgroundColor: "red",
    },
    headerTintColor: "#FFFFFF",
    headerBackTitle: "blue",
};

export default function AppNavigation() {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={screenOptionStyle}>
            
                <Stack.Screen name="AllChannels" component={AllChannels} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}