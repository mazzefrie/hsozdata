var express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  port = process.env.PORT || 3000,
  Conference = require('./api/models/conferenceModel'),
  Participants = require('./api/models/participantsModel'),
  Communities = require('./api/models/communitiesModel'),
  CommunityTopic = require('./api/models/communityTopicModel'),
  bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/out-0205'); 

var routes = require('./api/routes/backendRoutes'); //importing route
routes(app); //register the route


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);