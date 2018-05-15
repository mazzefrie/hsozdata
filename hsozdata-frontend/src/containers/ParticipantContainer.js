import React, {Component} from 'react';
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

class ParticipantContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			participant: [],
			name: '',
			class_: 0,
			count: 0
		};
		this.handleFullNameChange = this.handleFullNameChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}
	handleFullNameChange(e) {
		this.setState({ name: e.target.value });
	}
	handleFormSubmit(e) {

		e.preventDefault();
		fetch(HSKAPI+'/participant/' + this.state.name.toUpperCase() )
      		.then(response => response.json())
      		.then(data => {
      			this.setState({ participant: data }) 
      		});
	}
	componentWillMount() {

		if (this.props.match.params.number != 0) {

			var url = '';

			if( isNaN(this.props.match.params.number) ) {
				url = HSKAPI+'/participant/';
			} else {
				url = HSKAPI+'/participant/id/';
			}

    		fetch(url+this.props.match.params.number)
      		.then(response => response.json())
      		.then(data => {

      			this.setState({ count: data[0].count})
      			this.setState({ class_: data[0].comm.Class})
      			this.setState({ participant: data }) 
      			this.setState({ name: data[0].Person })
      		});
      	}

      	this.setState({ name: "" })
  	}

	render() {
		
		var conferenceList = Object.keys(this.state.participant).map((k, idx) => {
               return (
               		<ListGroupItem> 
               			<a href={"/conference/"+this.state.participant[k].CID}> 
               				{this.state.participant[k].conf.Title} ({this.state.participant[k].CID}) ({this.state.participant[k].conf.Community})
               			</a>
               		</ListGroupItem>
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
     						value={this.state.name}
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

				<h2>{this.state.name}</h2>
					<dl className="row">
  						<dt className="col-sm-3">Community</dt>
  						<dd className="col-sm-9">
  							<a href={"/community/"+this.state.class_}>{this.state.class_}</a>
  						</dd>

  						<dt className="col-sm-3">Konferenzen</dt>
  						<dd className="col-sm-9">{this.state.count}</dd>
					</dl>

				<ListGroup>
					{conferenceList}
				</ListGroup>
			</div>
		);
	}
}

export default ParticipantContainer;