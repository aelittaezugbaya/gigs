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
            center: [-74.50, 40], // starting position
            zoom: 9 // starting zoom
        });
        
        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl());
    }
    render(){
        return(
            <div id ='map'></div>
        );
    }
}