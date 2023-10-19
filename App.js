import React from "react"


import { NavigationContainer } from "@react-navigation/native"

import { createStackNavigator } from "@react-navigation/stack"
import Login from "./src/screens/Login"
import ChatScreen from "./src/screens/ChatScreen"
import AllChannels from "./src/screens/AllChannels"



const Stack = createStackNavigator()



const App = () => {

  const screenOptions = {
    headerShown: false
  }


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={screenOptions}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="AllChannels" component={AllChannels} />



      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App