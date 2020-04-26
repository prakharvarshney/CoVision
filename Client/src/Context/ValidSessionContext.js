import React, { useEffect, useState } from 'react';

export const ValidSessionContext = React.createContext();

export default ({ children }) => {

    const isUserAuthenticatedEndpoint = "/api/verifySession";
    const isUserAuthenticatedOptions =  {
        method: "POST",
        credentials: 'include',
        headers: {
        "Content-Type": "application/json",     
        }};

    async function userAuth ()
    {
        
        const response = await fetch(isUserAuthenticatedEndpoint, isUserAuthenticatedOptions)
        const json = await response.json();
        if(json.status == "Valid Session")
        {
            return true;
        }
        else{
            return false
        }
        
    };
    const defaultContext = {
        userAuth: userAuth
    };
    return (
        <ValidSessionContext.Provider value={defaultContext}>
        {children}
        </ValidSessionContext.Provider>
    );
};
