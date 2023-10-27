// const BASE_URL = 'https://tropatest.ifrs16.app';
// const BASE_URL = 'https://sufyan.go-tropa.com';
// const BASE_URL = 'http://192.168.70.184:8069';
// BASE URL
// const BASE_URL = 'http://10.1.1.58:8069';
const BASE_URL = 'http://10.1.1.65:8069';


import AsyncStorage from '@react-native-async-storage/async-storage';

// calling login API
export const login = (username, password, DATABASE_NAME, Url) => {
    console.log(`${Url}/web/session/authenticate`)
    return fetch(`${Url}/web/session/authenticate`, {
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


export const getAllChannel = (Url) => {
    console.log(`${Url}/mail/init_messaging`)
    return fetch(`${Url}/mail/init_messaging`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "call",
            params: {

            }
        }),
    }).then(res => res.json());
}


// 0492771100
//     772600


export const getAllMeassage = (Url,channel_id,limit) => {
    console.log(channel_id,"  >>>>>>>>>>>> ",limit)
    console.log(`${Url}/mail/channel/messages/`)
    return fetch(`${Url}/mail/channel/messages/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "channel_id": channel_id,
                "limit": limit
            }
        })
    }).then(res => res.json());
}



export const usersendMessage = (channelId, message, Url) => {
    console.log(`${Url}/mail/message/post`)
    return fetch(`${Url}/mail/message/post`, {
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
export const storeCredential = async (usermail, uid, username, Url,partnerId) => {
    console.log("username>>>>>>>", username)
    try {
        await AsyncStorage.setItem('email', usermail.toString())
        // await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('uid', uid.toString())
        await AsyncStorage.setItem('username', username.toString())
        await AsyncStorage.setItem('URL', Url.toString())
        await AsyncStorage.setItem('partnerId', partnerId.toString())


    } catch (e) {
        console.log("error", e)
    }
}
