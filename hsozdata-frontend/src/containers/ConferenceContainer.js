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


class ConferenceContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			conference: [],
			participants: []
		};
	}

	componentWillMount() {
    	fetch('http://127.0.0.1:3000/conference/'+this.props.match.params.number)
      		.then(response => response.json())
      		.then(data => {
      			this.setState({ conference: data[0] });
      		});

      		fetch('http://127.0.0.1:3000/participants/'+this.props.match.params.number)
		      		.then(response => response.json())
		      		.then(pdata => {
		      			this.setState({ participants: pdata });
		   	});
  	}

	render() {

		var participantList = Object.keys(this.state.participants).map((k, idx) => {
               return (
                <ListGroupItem><a href={"/participant/"+this.state.participants[k].Person}>{this.state.participants[k].Person}</a></ListGroupItem>
               );
        });

		return (
				<div>
					<h2>{this.state.conference.Title}</h2>
					<dl className="row">
  						<dt className="col-sm-3">Epochen</dt>
  						<dd className="col-sm-9">{this.state.conference.Epoche}</dd>

  						<dt className="col-sm-3">Themen</dt>
  						<dd className="col-sm-9">{this.state.conference.Thema}</dd>
   						
   						<dt className="col-sm-3">Community</dt>
  						<dd className="col-sm-9">
  							<a href={"/community/"+this.state.conference.Community}>{this.state.conference.Community}</a>
  						</dd>
    					
    					<dt className="col-sm-3">Teilnehmer</dt>
  						<dd className="col-sm-9">{this.state.conference.Count}</dd>
					</dl>

					<ListGroup>
						{participantList}
					</ListGroup>
				</div>
			);
	}
}

export default ConferenceContainer;