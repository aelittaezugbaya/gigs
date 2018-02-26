import React from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Row, Col } from 'antd';

export default class Map extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        mapboxgl.accessToken = 'pk.eyJ1IjoiYWVsaXR0YWUiLCJhIjoiY2pkeWlsODg0MHp4dTMzbzZncTI0dzBpdCJ9.6YIUNwH0qV7HZqxkmel2DQ';
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v10',
            center: [ 24.9384, 60.1699], // starting position
            zoom: 13 // starting zoom
        });

         // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            fitBoundsOptions:{
                maxZoom:14
            },
            trackUserLocation: true
        }));
        navigator.geolocation.getCurrentPosition((position) => {
            const coords = position.coords;
            // map.flyTo( {center: [coords.longitude,coords.latitude]});
            map.setCenter([coords.longitude,coords.latitude])
        });
    }
    render(){
        return(
            <div id ='map'></div>
        );
    }
}