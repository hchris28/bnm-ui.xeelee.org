import React, { useEffect, useRef } from 'react';
import { MarkerClusterer, Marker, useGoogleMap } from '@react-google-maps/api';

const MarkerList = ({
    markers = [],
    defaultCenter,
    defaultZoom,
    setSelectedItem = () => {}
}) => {

    const map = useGoogleMap();
    const clustererRef = useRef();
    const MAP_MARKER = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z';

    useEffect(() => {
        clustererRef.current?.repaint()
    }, [markers.length])

    useEffect(() => {
        if (map) {
            if (markers.length > 0) {
                var bounds = new window.google.maps.LatLngBounds();
                for (var i = 0; i < markers.length; i++) {
                    bounds.extend(markers[i].location);
                }
                map.fitBounds(bounds);
            } else {
                map.setCenter(defaultCenter);
                map.setZoom(defaultZoom);
            }
        }
    }, [map, markers, defaultCenter, defaultZoom]);

    console.log(Date.now(), 'marker list rendered');

    return (
        <>
            <MarkerClusterer
                onLoad={clusterer => (clustererRef.current = clusterer)}
                onClick={(cluster => {  
                    let markers = cluster.getMarkers();
                    console.log(markers);
                    // TODO: can we do something here at max zoom?
                })}
            >
                {(clusterer) =>
                    markers.map((item) => (
                        <Marker
                            key={item.key}
                            position={item.location}
                            clusterer={clusterer}
                            noClustererRedraw={true} //https://github.com/JustFly1984/react-google-maps-api/issues/2849
                            icon={{
                                path: MAP_MARKER,
                                fillColor: "red",
                                fillOpacity: 0.9,
                                strokeWeight: 1,
                                strokeColor: "black",
                                rotation: 0,
                                scale: 1.7,
                                anchor: new window.google.maps.Point(0, 20),
                            }}
                            onClick={() => { setSelectedItem(item.pallet_id) }}
                        />
                    ))
                }
            </MarkerClusterer>
        </>
    )
}

export default MarkerList