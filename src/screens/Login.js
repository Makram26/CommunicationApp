import { Text, TouchableOpacity, View, TextInput } from 'react-native'
import React, { useState, useContext } from 'react'
import { login, storeCredential } from '../services'
import Spinner from 'react-native-loading-spinner-overlay';
import AuthContext from '../Components/AuthProvider';
import { ScrollView } from 'react-native';



const Login = ({ navigation }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [db, setDb] = useState("")
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)

    const { setUser } = useContext(AuthContext)




    const LogIn = async () => {
        if (username === "") {
            alert("Please Enter Your Email")
            return true
        }

        if (password === "") {
            alert("Please Enter Your Password")
            return true
        }
        if (db === "") {
            alert("Please Enter Database Name")
            return true
        }
        if (url === "") {
            alert("Please Enter URL")
            return true
        }
        if (username != "" && password != "" && db != "" && url != "") {
            try {
                setLoading(true)
                const response = await login(username.trim(), password.trim(), db.trim(), url.trim())
                // console.log(response.result.name)

                if (response.error && response.error.data.message != "Access Denied") {
                    alert(`database ${db} does not exist`)
                    setLoading(false)
                    return true
                }
                if (response.result) {
                    if (response.result.error) {
                        alert(response.result.error)
                        setLoading(false)
                        return true
                    }


                    storeCredential(username.trim(), response.result.uid, response.result.name, url.trim())
                    // setUser(response.result.uid)
                    setTimeout(() => {
                        setLoading(false)
                        setUser(response.result.uid)
                    }, 500);

                    // navigation.navigate("AllChannels", response.result.uid)
                }
                else {
                    setLoading(false)
                    alert("Username and password do not match!")
                }
            } catch (error) {
                setLoading(false)
                console.log("error", error)
                alert(error)
            }
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ flexGrow: 1 }}>

                {/* <View style={{ flex: 0.4, justifyContent: "flex-end", alignItems: "center", }}>
                        

                    </View> */}


                <View style={{ flex: 1, marginTop: 20, padding: 15, justifyContent: "center" }}>
                    <Text style={{ fontSize: 25, fontWeight: "600", color: "blue", marginBottom: 20 }}>Login</Text>
                    <View style={{ borderWidth: 1, borderRadius: 10, padding: 3, }}>
                        <TextInput
                            placeholder='Enter username'
                            style={{ fontSize: 15, marginLeft: 10 }}
                            value={username}
                            onChangeText={(val) => setUsername(val)}
                        />
                    </View>
                    <View style={{ borderWidth: 1, borderRadius: 10, padding: 3, marginTop: 25 }}>
                        <TextInput
                            placeholder='Enter password'
                            style={{ fontSize: 15, marginLeft: 10 }}
                            value={password}
                            onChangeText={(val) => setPassword(val)}
                        />
                    </View>
                    <View style={{ borderWidth: 1, borderRadius: 10, padding: 3, marginTop: 25 }}>
                        <TextInput
                            placeholder='Enter database name'
                            style={{ fontSize: 15, marginLeft: 10 }}
                            value={db}
                            onChangeText={(val) => setDb(val)}
                        />
                    </View>
                    <View style={{ borderWidth: 1, borderRadius: 10, padding: 3, marginTop: 25 }}>
                        <TextInput
                            placeholder='e.g http://192.168.70.184:8069 '
                            style={{ fontSize: 15, marginLeft: 10 }}
                            value={url}
                            onChangeText={(val) => setUrl(val)}
                        />
                    </View>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "blue",
                            marginTop: 50, padding: 10,
                            alignItems: "center",
                            borderRadius: 20,
                            width: "80%",
                            alignSelf: "center"
                        }}
                        onPress={() => LogIn()}
                    >
                        <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "700" }}>Login</Text>
                    </TouchableOpacity>

                </View>






            </ScrollView>

        </View>
    )
}

export default Login

