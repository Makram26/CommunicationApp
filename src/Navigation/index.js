import React,{useState} from 'react';


import AuthContext from '../Components/AuthProvider';


import Routes from './Routes';

export default function Providers(){
    
    const [user,setUser]=useState(null)
    const contextValue = { user, setUser };

    return(
        <AuthContext.Provider value={contextValue}>
         <Routes />
        </AuthContext.Provider>
    )
}