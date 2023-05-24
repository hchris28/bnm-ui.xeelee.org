import React from 'react'
import ReceivingQueryUI from '../../components/receiving-query-ui/receiving-query-ui';
import { GoogleMapInstanceContextProvider } from '../../contexts/google-map-instance/google-map-instance';

const Receiving = () => {
    return (
        <GoogleMapInstanceContextProvider>
            <ReceivingQueryUI />
        </GoogleMapInstanceContextProvider>
    )
}

export default Receiving