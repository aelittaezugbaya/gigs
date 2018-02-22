import React from 'react';
import Map from './Map';
import SideMenu from './SideMenu'
import { Row, Col, Grid } from 'react-bootstrap';

export default class App extends React.Component{
    render(){
        return(
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
        );
    }
}