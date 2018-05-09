import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import IndexContainer from './containers/IndexContainer';
import ConferenceContainer from './containers/ConferenceContainer';
import CommunityContainer from './containers/CommunityContainer';
import ParticipantContainer from './containers/ParticipantContainer';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Grid from 'react-bootstrap/lib/Grid';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

const App = () => (
  <div>
	<Navbar>
	  <Navbar.Header>
	    <Navbar.Brand>
	      <a href="#home">HSozData</a>
	    </Navbar.Brand>
	  </Navbar.Header>
	  <Nav>
	    <NavItem eventKey={1} href="#">
	      Link
	    </NavItem>
	  </Nav>
	</Navbar>		
  	<Grid>
	  <Row className="show-grid">
	    <Col xs={2} md={2}>

	    </Col>
	    <Col xs={8} md={8}>
	      <Main />
	    </Col>
	    <Col xs={2} md={2}>
	    </Col>
	  </Row>
	 </Grid>


  </div>
)

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={IndexContainer}/>
      <Route path='/conference/:number' component={ConferenceContainer}/>
      <Route path='/community/:number' component={CommunityContainer}/>
      <Route path='/participant/:number' component={ParticipantContainer}/>
    </Switch>
  </main>
)

const root = document.querySelector('#app')

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), root)