
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';


import AuthContext from '../Components/AuthProvider';


import AppNavigation from './AppNavigation';
import AuthNavigation from './AuthNavigation';

export default function Routes(props) {
    const { user, setUser } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const id = await AsyncStorage.getItem("uid");
            if (id !== null) {
                setUser(id);
            }
            setIsLoading(false)
        })();
    });
    return (
        <>
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#930000" />

                </View>
            ) : (
                <SafeAreaView style={{ flex: 1 }}>
                    {
                        user ?
                            <AppNavigation/>
                            :
                            <AuthNavigation />
                    }

                </SafeAreaView>
            )}
        </>

    );
}