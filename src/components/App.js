import React from 'react';
import Map from './Map';
import SideMenu from './SideMenu';
import Login from './Login';
import { Row, Col, Grid, Button } from 'react-bootstrap';

export default class App extends React.Component{
    constructor(props){
        super(props);

        this.logIn = this.logIn.bind(this);
    }

    componentDidMount(){
        console.log(window.location.hash);
        if(window.location.hash){
            const stateKey = 'spotify_auth_state';
            const params = this.getHashParams();

            const access_token = params.access_token
            const state = params.state
            const storedState = localStorage.getItem(stateKey);
            if (access_token && (state == null || state !== storedState)) {
              alert('There was an error during the authentication');
            } else {
              localStorage.removeItem(stateKey);
                if (access_token) {
                    window.fetch('https://api.spotify.com/v1/me', {
                        method: 'GET',
                        headers: {
                        'Authorization': 'Bearer ' + access_token
                        }
                    })
                    .then((response) => {return response.json()})
                    .then((data) => {
                        console.log(data)
                    })
                    
                }
            }
        }
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

    generateRandomString(length) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      };

    logIn(){
        const stateKey1 = 'spotify_auth_state';
        const client_id = '71247e62ff56404586d3398c81b57cf0'; // Your client id
        const redirect_uri = 'http://localhost:8080/'; // Your redirect uri
        const state = this.generateRandomString(16);
        const stateKey = 'spotify_auth_state';
        localStorage.setItem(stateKey1, state);
        const scope = 'user-read-private user-read-email';
        let url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(client_id);
        url += '&scope=' + encodeURIComponent(scope);
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
        url += '&state=' + encodeURIComponent(state);
        window.location = url;
        
    }
    render(){
        return(
            <Login/>
            // <Grid fluid>
            //     <Row>
            //         <Col md={9}>
            //             <Map/>
            //         </Col>
            //         <Col md={3}>
            //             <SideMenu/>
            //             <Button onClick={this.logIn}> Log in</Button>
            //         </Col>
            //     </Row>
            // </Grid>
        );
    }
}