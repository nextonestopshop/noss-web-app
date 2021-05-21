import React, { useEffect, useState, createContext, useContext } from "react";
import { auth } from "./firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user)
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser }} >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};