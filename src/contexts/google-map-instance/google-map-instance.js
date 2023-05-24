import { useContext, createContext, useState } from "react";

const GoogleMapInstanceContext = createContext();

const useGoogleMapInstanceContext = function () {
    return useContext(GoogleMapInstanceContext);
}

const GoogleMapInstanceContextProvider = ({ children }) => {

    const [ mapInstance, setMapInstance ] = useState(null);

    return (
        <GoogleMapInstanceContext.Provider value={{ mapInstance, setMapInstance }}>
            {children}
        </GoogleMapInstanceContext.Provider>
    );
}

export { 
    GoogleMapInstanceContext as default, 
    GoogleMapInstanceContextProvider, 
    useGoogleMapInstanceContext 
};