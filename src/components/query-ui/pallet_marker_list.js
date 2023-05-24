import React, { useEffect } from 'react';
import { Marker, useGoogleMap } from '@react-google-maps/api';

const PalletMarkerList = ({
    markers = []
}) => {

    const map = useGoogleMap();
    const MAP_MARKER = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z';


    useEffect(() => {
        if (map && markers.length > 0) {
            var bounds = new window.google.maps.LatLngBounds();
            for (var i = 0; i < markers.length; i++) {
                bounds.extend(markers[i].location);
            }
            map.fitBounds(bounds);
        }
    }, [map, markers]);

    return (
        <>
            {
                markers.map((item, idx) => {
                    let isLastItem = (idx + 1) === markers.length;
                    return (
                        <Marker
                            key={item.key}
                            position={item.location}
                            label={{
                                text: item._date + (isLastItem ? " (LAST KNOWN)" : ""),
                                color: '#ffffff',
                                fontWeight: '700'
                            }}
                            icon={{
                                path: MAP_MARKER,
                                fillColor: "red",
                                fillOpacity: isLastItem ? 0.9 : 0.5,
                                strokeWeight: 1,
                                strokeColor: "black",
                                rotation: 0,
                                scale: isLastItem ? 1.7 : 1.2 ,
                                anchor: new window.google.maps.Point(0, 20),
                            }}
                        />
                    )
                })
            }
        </>
    )
}

export default PalletMarkerList