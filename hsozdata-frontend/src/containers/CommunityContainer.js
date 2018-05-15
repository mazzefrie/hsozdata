import React, {Component} from 'react';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import FormControl from 'react-bootstrap/lib/FormControl'
import ListGroup from 'react-bootstrap/lib/ListGroup'
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import ToggleButton from 'react-bootstrap/lib/ToggleButton'
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup'
import Pagination from 'react-bootstrap/lib/Pagination'
import Panel from 'react-bootstrap/lib/Panel'
import { ClipLoader } from 'react-spinners';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import 'whatwg-fetch'


class CommunityContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			community: [],
			isLoading: false,
			totalCount: 0,
			offset: 10,
			epochen: [],
			themen: [],
			tfidf: [],
		};
		this.handleFilterChange = this.handleFilterChange.bind(this);
	}

	handleFilterChange(e) {

		const f = function(data,this_) {
			this_.state.isLoading = false;
	      	this_.state.totalCount = data[0].count
	      	this_.setState({ community: data }) 
		}

		this.state.isLoading = true;
		if(e === 1) {
	    	fetch(HSKAPI+'/community/'+this.props.match.params.number )
	      		.then(response => response.json())
	      		.then(data => {f(data,this)});		
		}

		if(e === 2) {
	    	fetch(HSKAPI+'/community/'+this.props.match.params.number+'/?filterBy=conf' )
	      		.then(response => response.json())
	      		.then(data => {f(data,this)});			
		}
		if(e === 3) {
	    	fetch(HSKAPI+'/community/'+this.props.match.params.number+'/?filterBy=person' )
	      		.then(response => response.json())
	      		.then(data => {f(data,this)});			
		}
	}

	componentWillMount() {

		if(!this.props.match.params.offset)
			this.props.match.params.offset = 0

		this.state.isLoading = true;
    	fetch(HSKAPI+'/community/'+this.props.match.params.number+'/'+this.props.match.params.offset )
      		.then(response => response.json())
      		.then(data => {
      			this.state.isLoading = false;
      			this.state.totalCount = data[0].count
      			this.setState({ community: data }) 


      		});

		fetch(HSKAPI+'/tfidf/community/'+this.props.match.params.number )
      		.then(response => response.json())
      		.then(data => {
      			this.setState({ tfidf: data }) 
      		});

		fetch(HSKAPI+'/community/tags/'+this.props.match.params.number )
      		.then(response => response.json())
      		.then(data => {
      			
      			var themen = [];
      			var epochen_ = [];

      			Object.keys(data).map((k, idx) => {
      				
      				var topics = data[k].conf.Thema.split(",");

      				Object.keys(topics).map((k, idx) => {
      					if(!themen[topics[k]])
      					 	themen[topics[k]] = 0;
      					 themen[topics[k]] += 1;
      				});

      				var epoch = data[k].conf.Epoche.split(",");

      				Object.keys(epoch).map((k, idx) => {
      					if(!epochen_[epoch[k]])
      					 	epochen_[epoch[k]] = 0;
      					 epochen_[epoch[k]] += 1;
      				});
      			}); 

      				// AUFRÄUMEN: Sortiere Epochen und Themen nach Häufigkeit
	      			var sortable = [];
					for (var top in themen) {
					    sortable.push([top, themen[top]]);
					}

					sortable.sort(function(a, b) {

					    return b[1] - a[1];
					});

      				this.setState({ themen:  sortable});


	      			var sortable = [];
					for (var epo in epochen_) {
					    sortable.push([epo, epochen_[epo]]);
					}

					sortable.sort(function(a, b) {

					    return b[1] - a[1];
					});

      				this.setState({ epochen:  sortable});

      		});

  	}


	render() {
		
		const filterSwitch = (    
			  <ButtonToolbar>
			    <ToggleButtonGroup type="radio" onChange={this.handleFilterChange} name="options" defaultValue={1}>
			      <ToggleButton value={1}>keine Filter</ToggleButton>
			      <ToggleButton value={2}>nach Konferenzen</ToggleButton>
			      <ToggleButton value={3}>nach Personen</ToggleButton>
			    </ToggleButtonGroup>
			  </ButtonToolbar>
    	);

		const epochenList = Object.keys(this.state.epochen).map((k, idx) => {

			return (
				<div>{this.state.epochen[k][1]} - {this.state.epochen[k][0]} </div>
			)
		});

		const tfidfList = Object.keys(this.state.tfidf).map((k, idx) => {

			return (
				<div>{k}</div>
			)
		});

		const themenList = Object.keys(this.state.themen).map((k, idx) => {

			return (
				<div>{this.state.themen[k][1]} - {this.state.themen[k][0]} </div>
			)
		});

		const communityList = Object.keys(this.state.community).map((k, idx) => {

				var PID = this.state.community[k].PID.match(/\d+$/)
				var urlId = PID;
				var label = '';

				if( this.state.community[k].PID.includes("conf") ) {
					urlId = "/conference/"+PID;
					label = this.state.community[k].conf[0].Title;
				} else {
					urlId = "/participant/"+this.state.community[k].node.Label;
					label = this.state.community[k].node.Label;
				}

               return (
                <ListGroupItem>
                	<a href={urlId}> {label} ({PID})</a>
                </ListGroupItem>
               );
        });

		let items = [];
		for (let number = 1; number <= (this.state.totalCount / this.state.offset); number++) {
		  items.push(
		    <Pagination.Item href={"/community/"+this.props.match.params.number+"/" +this.state.offset*(number-1)} active={number === (this.props.match.params.offset/10)+1}>{number}</Pagination.Item>
		  );
		}

		const paginationBasic = (
		    <Pagination bsSize="medium">{items}</Pagination>
		);

		return (
			
			<div>
			    <ClipLoader color={'#123abc'} loading={this.state.isLoading}  />

			    <Row className="show-grid">
				    <Col xs={7} md={7}>
						<ListGroup>
							{communityList}
						</ListGroup>
				    </Col>
				    <Col xs={3} md={3}>
						{filterSwitch}

				    </Col>
	  			</Row>
	  			{paginationBasic}
			    <Row className="show-grid">
				    <Col xs={5} md={5}>
				    	<Panel>
					    	<Panel.Heading>
	      						<Panel.Title componentClass="h3">Epochen</Panel.Title>
	    					</Panel.Heading>
	   						<Panel.Body>
								{epochenList}
							</Panel.Body>
						</Panel>
				    </Col>
				    <Col xs={5} md={5}>
				    	<Panel>
				    		<Panel.Heading>
	      						<Panel.Title componentClass="h3">Epochen</Panel.Title>
	    					</Panel.Heading>
	   						<Panel.Body>
								{themenList}
							</Panel.Body>
						</Panel>
				    </Col>
	  			</Row>

	  							    		<Panel.Heading>
	      						<Panel.Title componentClass="h3">TFIDF Liste</Panel.Title>
	    					</Panel.Heading>
	   						<Panel.Body>
								{tfidfList}
							</Panel.Body>
	  						
						
	  			
				
			</div>

		);
	}
}

export default CommunityContainer;