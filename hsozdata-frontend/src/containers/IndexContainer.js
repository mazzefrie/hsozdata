import React, {Component} from 'react';
import Form from 'react-bootstrap/lib/Form';


import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import FormControl from 'react-bootstrap/lib/FormControl'
import ListGroup from 'react-bootstrap/lib/ListGroup'
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'

import 'whatwg-fetch'


function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <Col componentClass={ControlLabel} sm={2}><ControlLabel>{label}</ControlLabel> </Col>
      <Col sm={6}><FormControl {...props} /> </Col>
    </FormGroup>
  );
}


class IndexContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			conferenceid: 5000,
			conferenceList: [],
			conference: {
				title: ''
			}
		};
		this.handleFullNameChange = this.handleFullNameChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}
	handleFullNameChange(e) {
		this.setState({ conferenceid: e.target.value });
	}
	handleFormSubmit(e) {

		e.preventDefault();
		fetch(HSKAPI+'/conference/' + parseInt(this.state.conferenceid))
      		.then(response => response.json())
      		.then(data => {
      			var conf = {};
      			conf.title = data[0]['Title']; 
      			this.setState({ conference: conf }) 
      		});
	}

	componentWillMount() {
    	fetch(HSKAPI+'/conferences/')
      		.then(response => response.json())
      		.then(data => {
      			this.setState({ conferenceList: data }) 
      		});
  	}

	render() {
		
		 var properties = Object.keys(this.state.conferenceList).map((k, idx) => {
               return (
                 	<ListGroupItem><a href={"/conference/"+this.state.conferenceList[k].CID}>{this.state.conferenceList[k].Title}</a></ListGroupItem>
               );
        });

		return (
			<div>

				<form className="container" onSubmit={this.handleFormSubmit}>
					    <Row className="show-grid">
					    	<FieldGroup
      						id="formControlsText"
     						type="text"
      						label="Text"
      						placeholder="Enter text"
     						content={this.state.conferenceid}
      						onChange={this.handleFullNameChange}
    						/>
    					</Row>

					<Row className="show-grid">
					<input
						type="submit"
						className="btn btn-primary float-right"
						value="Submit"/>
					</Row>

				</form>
				<div>
					{this.state.conference.title}
				</div>
 				<div>
 					<ListGroup>
                    	{properties}
                    </ListGroup>
                </div>

			</div>
		);
	}
}

export default IndexContainer;