import React from 'react';
import {connect} from 'react-redux';
import actions from '../redux/actions';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Row, Col } from 'antd';
import 'lodash';
import cities from 'cities.json';


class Map extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            settings: this.props.settings
        }
        
        this.findGigs = this.findGigs.bind(this)
    }
    
    componentWillReceiveProps(nextProps){
       
        if(_.isEqual(this.props.settings, nextProps.settings) == false){
            this.props=nextProps;
            this.findGigsBySettings(nextProps.settings)
        }
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
            //this.findGigs(coords.latitude, coords.longitude, map)
            this.setState({
                map: map,
                latitude: coords.latitude,
                longitude: coords.longitude
            })
            this.findGigs(this.state.latitude, this.state.longitude, this.state.map)
        });
    }

    putMarkers(map,events){
        const gigs = [];
        if(map.getLayer("places")){
            map.removeLayer("places");
            map.removeSource('source');
        }
        events.forEach(event => {
            gigs.push({
                "type": "Feature",
                "properties": {
                    "description": "<strong>"+event.title+"</strong><p>"+event.description+"</p><a href='"+event.url+"'target=\"_blank\" title=\"Opens in a new window\">Link to the event</a>",
                    "icon": "music"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [event.longitude,event.latitude]
                }
            })
        })

        map.addSource('source',{
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": gigs
            }
        })
        map.addLayer({
            "id": "places",
            "type": "symbol",
            "source": 'source',
            "layout": {
                "icon-image": "{icon}-15",
                "icon-allow-overlap": true
            }
        });

        map.on('click', 'places', function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;
            
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'places', function () {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'places', function () {
            map.getCanvas().style.cursor = '';
        });

    }

    findGigs(latitude, longitude, map){
        const origin = 'https://cors-anywhere.herokuapp.com/';
        let url = 'http://api.eventful.com/json/events/search?app_key=vHdXThWsm6Xn9HPP&';
        url+='&where='+encodeURIComponent(latitude)+','+encodeURIComponent(longitude);
        url+='&category=music';
        url+='&within='+encodeURIComponent(this.props.settings.range)+'&units=km';
        url+='&sort_order=date&page_size=20&date=Future';
        url+='&keywords='
        for(const genre of this.props.settings.genres){
            url+=encodeURIComponent(genre)+',';
        }
        window.fetch(origin+url, {
            method: 'GET',
        }).then((data) => data.json())
        .then((data) => {
            this.props.receiveGigs(data.events.event);
            this.putMarkers(map, data.events.event);
        });
    }

    findGigsBySettings(settings){
        
        if(settings.city){
            window.fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${settings.city}.json?access_token=pk.eyJ1IjoiYWVsaXR0YWUiLCJhIjoiY2pkdzF3bWN6MGZudjJ2b2hlN2x0ZWM2OCJ9.lM3nZt9piPiGYrpDiGAOHw&autocomplete=true&limit=1`,{
                method:'GET'
            }).then(data => data.json())
            .then(data => {
                this.state.map.setCenter(data.features[0].center);
                this.findGigs(data.features[0].center[1],data.features[0].center[0],this.state.map)
            });
        } else {
            this.findGigs(this.state.latitude,this.state.longitude, this.state.map)
        }
    }

    renderMap(){



    }

    render(){  
        return(
            <div id ='map'></div>
        );
    }
}

const mapStateToProps = ({gigs,settings}) => ({
  gigs,settings
});

const mapDispatchToProps = (dispatch) => ({
  receiveGigs: (gigs) => dispatch({
    type: actions.RECEIVE_GIGS,
    payload: gigs,
  })
})

export default connect(mapStateToProps, mapDispatchToProps)(Map);
