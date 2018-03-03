import React from 'react';
import { Row, Col, Grid, Button } from 'react-bootstrap';

export default class Login extends React.Component{
    render(){
        return(
            <Grid fluid>
                <Row>
                    <Col md={6} >
                        <div className='login100-more'></div>
                    </Col>
                    <Col md={6}>
                    <div className='login100-form'>
                        <span className="login100-form-title p-b-34">
                            Spotify Login
                            <img src="./src/Spotify_logo_with_text.svg.png" />
                        </span>
                            <div className="container-login100-form-btn">
                                <button className="login100-form-btn">
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