import React from 'react'
import InventoryQueryUI from '../../components/inventory-query-ui/inventory-query-ui';
import { GoogleMapInstanceContextProvider } from '../../contexts/google-map-instance/google-map-instance';

const Inventory = () => {
    return (
        <GoogleMapInstanceContextProvider>
            <InventoryQueryUI />
        </GoogleMapInstanceContextProvider>
    )
}

export default Inventory