import React from "react"
import Providers from "./src/Navigation";
import { LogBox } from 'react-native';




LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications






const App = () => {

  

  return (
    <Providers/>
  )
}

export default App