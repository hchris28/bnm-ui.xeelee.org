import React from 'react'
import QueryUI from '../../components/query-ui/query-ui';
import { GoogleMapInstanceContextProvider } from '../../contexts/google-map-instance/google-map-instance';

const Query = () => {
    return (
        <GoogleMapInstanceContextProvider>
            <QueryUI />
        </GoogleMapInstanceContextProvider>

    )
}

export default Query