import React, {Component} from 'react';
import Form from 'react-bootstrap/lib/Form';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import FormControl from 'react-bootstrap/lib/FormControl'
import ListGroup from 'react-bootstrap/lib/ListGroup'
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'
import Panel from 'react-bootstrap/lib/Panel'
import WordcloudContainer from './WordcloudContainer'

import 'whatwg-fetch'


class ConferenceContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			conference: [],
			participants: [],
      wordModel: [],
		};
	}

	componentWillMount() {
    	fetch(HSKAPI+'/conference/'+this.props.match.params.number)
      		.then(response => response.json())
      		.then(data => {
      			this.setState({ conference: data[0] });
            this.setState({ wordModel: data[0].tfidf.ftfidf_model });
      		});

      		fetch(HSKAPI+'/participants/'+this.props.match.params.number)
		      		.then(response => response.json())
		      		.then(pdata => {
		      			this.setState({ participants: pdata });
		   	});
  	}

	render() {


    var wordModelList = Object.keys(this.state.wordModel).map((k, idx) => {
               return (
                <li>{this.state.wordModel[k].id}</li>
               );
        });

		var participantList = Object.keys(this.state.participants).map((k, idx) => {
               return (
                <ListGroupItem>
                	<a href={"/participant/"+this.state.participants[k].Person}>{this.state.participants[k].Person}  </a>
                	<a href={"/community/"+this.state.participants[k].comm.Class}>({this.state.participants[k].comm.Class})</a>
                </ListGroupItem>
               );
        });

		return (
				<div>
					<h2>{this.state.conference.Title}</h2>

          <WordcloudContainer data={this.state.wordModel} />

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

          <Row className="show-grid">
            <Col xs={5} md={5}>
              <Panel>
                <Panel.Heading>
                    <Panel.Title componentClass="h3">Teilnehmer</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                   <ListGroup>
                      {participantList}
                  </ListGroup>
              </Panel.Body>
            </Panel>
            </Col>
            <Col xs={5} md={5}>
              <Panel>
                <Panel.Heading>
                    <Panel.Title componentClass="h3">TF IDF</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                  {wordModelList}
              </Panel.Body>
            </Panel>
            </Col>
          </Row>
          
				</div>
			);
	}
}

export default ConferenceContainer;