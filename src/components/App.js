import React from 'react';
import Map from './Map';
import SideMenu from './SideMenu';
import Login from './Login';
import { Row, Col, Grid, Button } from 'react-bootstrap';
import jwt_decode from 'jwt-decode';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import actions from '../redux/actions';


class App extends React.Component {
    constructor(props) {
        super(props);
        if (window.location.hash) {
            const stateKey = 'spotify_auth_state';
            const params = this.getHashParams();

            const access_token = params.access_token
            const state = params.state
            const storedState = localStorage.getItem(stateKey);
            window.localStorage.accessToken = access_token;
            this.state = {
                jwt: window.localStorage.accessToken
            }
            window.location = 'http://localhost:8080/';
        }
        this.state = {
            jwt: window.localStorage.accessToken ? window.localStorage.accessToken : ''
        }
    }



    getHashParams() {
        const hashParams = {};
        let e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    render() {
        let { jwt } = this.state;
        return (
            <div className='app'>
                {jwt ?
                    <Spin spinning={this.props.loading} tip="Loading ... Please wait while we are looking for event(Don't press anything)" size='large'>
                        <Grid fluid>
                            <Row>
                                <Col md={9}>
                                    <Map />
                                </Col>
                                <Col md={3}>
                                    <SideMenu />
                                </Col>
                            </Row>
                        </Grid>
                    </Spin>
                    : <Login />
                }
            </div>
        );
    }
}

const mapStateToProps = ({ gigs, settings, gigsByArtist, loading }) => ({
    gigs,
    settings,
    gigsByArtist,
    loading
});

const mapDispatchToProps = dispatch => ({
    receiveGigs: gigs =>
        dispatch({
            type: actions.RECEIVE_GIGS,
            payload: gigs,
        }),
    setGigsByArtist: gigs =>
        dispatch({
            type: actions.SET_GIGS_BY_ARTISTS,
            payload: gigs,
        }),
    updateLoading: ready =>
        dispatch({
            type: actions.SET_LOADING,
            payload: ready,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);