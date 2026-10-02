import React, {createContext, useState, useEffect, useContext} from 'react';

const AuthContext = createContext();

export const useAuth = ()=>{
    return useContext(AuthContext);
}

export const AuthProvider = ({children})=>{
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(()=>{
        const userId = localStorage.getItem('userId');   // Local storage survives the refresh page
        if(userId){
            setCurrentUser(userId);
        }
    }, []);

    const value = {
        currentUser, setCurrentUser
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>  // children is the App component.
}