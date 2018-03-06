import React from 'react';
import Map from './Map';
import SideMenu from './SideMenu';
import Login from './Login';
import { Row, Col, Grid, Button } from 'react-bootstrap';
import jwt_decode from 'jwt-decode';


export default class App extends React.Component{
    constructor(props){
        super(props);
        if(window.location.hash){
            const stateKey = 'spotify_auth_state';
            const params = this.getHashParams();

            const access_token = params.access_token
            const state = params.state
            const storedState = localStorage.getItem(stateKey);
            window.localStorage.accessToken = access_token;
            this.state={
                jwt: window.localStorage.accessToken
            }
            window.location='http://localhost:8080/';
        }
        this.state={
            jwt: window.localStorage.accessToken ? window.localStorage.accessToken: ''
          }
        this.getFavouriteArtists();
    }

    getFavouriteArtists(){
        window.fetch('https://api.spotify.com/v1/me/top/artists',{
            method:'GET',
            headers:{
                Authorization: 'Bearer '+this.state.jwt
            }
        }).then(data => data.json())
        .then(data =>{
            const artists=[];
            data.items.map(artist => artists.push({id:artist.id, name: artist.name, genres: artist.genres}))
            let string='';
            for(let i = 0; i<5;i++){
                string+= artists[i].id+','
            }
            console.log(string)
            window.fetch(`https://api.spotify.com/v1/recommendations?limit=100&seed_artists=`+string,{
                headers:{
                    Authorization: 'Bearer '+this.state.jwt
                }
            }).then(data => data.json())
            .then(data=>{
                console.log(data.tracks[0].artists[0].name)
                const recommendedArtists=[];
                data.tracks.map(track=>{
                    if(!recommendedArtists.includes(track.artists[0].name)){
                        recommendedArtists.push(track.artists[0].name)
                    }
                    
                })
                console.log(recommendedArtists)
                const origin = 'https://cors-anywhere.herokuapp.com/';
                let url = 'http://api.eventful.com/json/events/search?app_key=vHdXThWsm6Xn9HPP&';
                url+='&category=music&page_size=100';
                url+='&keywords=title:'+encodeURIComponent(recommendedArtists[0]);
                window.fetch(origin+url,{
                    method: 'GET'
                }).then(data=>data.json())
                .then(data=>{
                    console.log(data);
                    const sortedByName=[];
                    data.events.event.map(event=>{
                        if(event.performers !=null){
                                if(event.performers.performer.name){
                                    if(event.performers.performer.name.toUpperCase() == recommendedArtists[0].toUpperCase()){
                                            sortedByName.push(event);
                                        }
                                }else{
                                    console.log(event.performers.performer)
                                    event.performers.performer.map(music => {
                                        console.log(music)
                                        if(music.name.toUpperCase() == recommendedArtists[0].toUpperCase()){
                                            //console.log(music)
                                            sortedByName.push(event);
                                        }
                                    })
                                }
                                // 
                            
                        }
                    })
                    console.log(sortedByName)
                })
            })
        
        });
    }

    getHashParams() {
        const hashParams = {};
        let e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
           hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
      }
  
    render(){
        let {jwt}=this.state;
        return(
            <div className='app'>
                {jwt ?
                <Grid fluid>
                    <Row>
                        <Col md={9}>
                            <Map/>
                        </Col>
                        <Col md={3}>
                            <SideMenu/>
                        </Col>
                    </Row>
                </Grid>
                : <Login/>
                }
            </div>
        );
    }
}