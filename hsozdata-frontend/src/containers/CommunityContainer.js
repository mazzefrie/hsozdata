import React, {Component} from 'react';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import FormControl from 'react-bootstrap/lib/FormControl'
import ListGroup from 'react-bootstrap/lib/ListGroup'
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'
import 'whatwg-fetch'


class CommunityContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			community: [],
		};
	}
	componentWillMount() {
    	fetch('http://127.0.0.1:3000/community/'+this.props.match.params.number)
      		.then(response => response.json())
      		.then(data => {
      			this.setState({ community: data }) 
      		});
  	}

	render() {
		
		var communityList = Object.keys(this.state.community).map((k, idx) => {
               return (
                <ListGroupItem>{this.state.community[k].PID}</ListGroupItem>
               );
        });
		return (
			<ListGroup>
				{communityList}
			</ListGroup>
		);
	}
}

export default CommunityContainer;