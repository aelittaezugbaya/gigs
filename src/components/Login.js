import React from 'react';
import { Row, Col, Grid, Button } from 'react-bootstrap';

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.logIn = this.logIn.bind(this);
    }


    generateRandomString(length) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    logIn() {
        const stateKey1 = 'spotify_auth_state';
        const client_id = '71247e62ff56404586d3398c81b57cf0'; // Your client id
        const redirect_uri = 'https://users.metropolia.fi/~aelittae/gigs/'; // Your redirect uri
        const state = this.generateRandomString(16);
        const stateKey = 'spotify_auth_state';
        localStorage.setItem(stateKey1, state);
        const scope = 'user-read-private user-read-email user-top-read';
        let url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(client_id);
        url += '&scope=' + encodeURIComponent(scope);
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
        url += '&state=' + encodeURIComponent(state);
        window.location = url;

    }
    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col md={6} >
                        <div className='login100-more'></div>
                    </Col>
                    <Col md={6}>
                        <div className='login100-form'>
                            <span className="login100-form-title p-b-34">
                                Spotify Login
                            <img src="../Spotify_logo_with_text.svg.png" />
                            </span>
                            <div className="container-login100-form-btn">
                                <button className="login100-form-btn" onClick={this.logIn}>
                                    Sign in with spotify
                                </button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}