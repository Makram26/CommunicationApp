import React from "react";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native'
import Login from "../screens/Login";


const Stack = createStackNavigator();
const screenOptionStyle = {
    headerStyle: {
        backgroundColor: "red",
    },
    headerTintColor: "#FFFFFF",
    headerBackTitle: "blue",
};

export default function AuthNavigation() {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={screenOptionStyle}>
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}