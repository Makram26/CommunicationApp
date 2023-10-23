// const BASE_URL = 'https://tropatest.ifrs16.app';
// const BASE_URL = 'https://sufyan.go-tropa.com';
// const BASE_URL = 'http://192.168.70.184:8069';
// BASE URL
// const BASE_URL = 'http://10.1.1.58:8069';
const BASE_URL = 'http://192.168.10.3:8069';


import AsyncStorage from '@react-native-async-storage/async-storage';

// calling login API
export const login = (username, password, DATABASE_NAME) => {
    console.log(`${BASE_URL}/web/session/authenticate`)
    return fetch(`${BASE_URL}/web/session/authenticate`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            params: {
                login: username,
                password: password,
                db: DATABASE_NAME,
            }
        }),
    }).then(res => res.json());
}


export const getAllChannel = (uid) => {
      console.log(`${BASE_URL}/mail/init_messaging`)
    return fetch(`${BASE_URL}/mail/init_messaging`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id:1,
            method:"call",
            params:{

            }
        }),
    }).then(res => res.json());
}


// 0492771100
//     772600


export const getAllMeassage = (channelId) => {

    return fetch(`${BASE_URL}/mail/channel/messages/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        },
    }).then(res => res.json());
}



export const usersendMessage = (channelId, message) => {

    return fetch(`${BASE_URL}/mail/message/post`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "params": {
                "thread_model": "mail.channel",
                "thread_id": channelId,
                "post_data": {
                    "attachment_ids": [],
                    "body": message,
                    "message_type": "comment",
                    "partner_ids": [],
                    "subtype_xmlid": "mail.mt_comment"
                }
            }
        })
    }).then(res => res.json());
}


// session management 
export const storeCredential = async (usermail,uid,username) => {
    console.log("username>>>>>>>", username)
    try {
        await AsyncStorage.setItem('email', usermail.toString())
        // await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('uid', uid.toString())
        await AsyncStorage.setItem('username', username.toString())
    } catch (e) {
        console.log("error", e)
    }
}
