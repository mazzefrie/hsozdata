import React, {Component} from 'react';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import FormControl from 'react-bootstrap/lib/FormControl'
import ListGroup from 'react-bootstrap/lib/ListGroup'
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'
import 'whatwg-fetch'


class ParticipantContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			participant: [],
		};
	}
	componentWillMount() {
    	fetch('http://127.0.0.1:3000/participant/'+this.props.match.params.number)
      		.then(response => response.json())
      		.then(data => {
      			this.setState({ participant: data }) 
      		});
  	}

	render() {
		
		var participantList = Object.keys(this.state.participant).map((k, idx) => {
               return (<ListGroupItem><a href={"/conference/"+this.state.participant[k].CID}>{this.state.participant[k].CID}</a></ListGroupItem>
               );
        });
		return (
			<ListGroup>
				{participantList}
			</ListGroup>
		);
	}
}

export default ParticipantContainer;