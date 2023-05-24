import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useGoogleMapInstanceContext } from '../../contexts/google-map-instance/google-map-instance';
import MarkerList from './marker-list';

const MapContainer = ({
    markers = [],
    setSelectedItem = () => {}
}) => {

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        //libraries: ['geometry', 'drawing'],
    });

    const mapStyles = {
        height: "100%",
        width: "100%"
    };

    const defaultCenter = {
        lat: 39.95104371547263, lng: -98.83661617073007
    }

    const defaultZoom = 5;

    const { setMapInstance } = useGoogleMapInstanceContext();
    const onMapLoaded = (map) => {
        setMapInstance(map);
    };

    return (
        <>
            {isLoaded &&
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={defaultZoom}
                    center={defaultCenter}
                    labels={true}
                    options={{
                        fullscreenControl: false,
                        mapTypeId: "hybrid"
                    }}
                    onLoad={onMapLoaded}
                >
                    <MarkerList
                        markers={markers}
                        defaultCenter={defaultCenter}
                        defaultZoom={defaultZoom}
                        setSelectedItem={setSelectedItem}
                    />
                </GoogleMap>
            }
        </>

    )
}

export default React.memo(MapContainer)