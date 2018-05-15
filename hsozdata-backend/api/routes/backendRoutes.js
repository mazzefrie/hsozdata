'use strict';
module.exports = function(app) {

	var confi = require('../controllers/conferencesController');
	var parti = require('../controllers/participantsController');
	var comm = require('../controllers/communitiesController');

	app.all('/*', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	})


	// Hole TFIDF der Community
	app.route('/tfidf/community/:classid')
	    .get(comm.requestTFIDF)

	app.route('/community/tags/:classid')
	    .get(comm.requestTags)

	app.route('/community/:classid/:offset?')
	    .get(comm.listByClass)

	app.route('/community/topic/:classid')
	    .get(comm.listTopicyByClass)


	app.route('/conferences/:offset?')
	    .get(confi.listAll)

	app.route('/conference/:confid')
	    .get(confi.listBy)

	app.route('/participant/id/:id')
	    .get(parti.listOneByPID)

	app.route('/participant/:name')
	    .get(parti.listByName)


	app.post('/conferences', function (req, res) {
  		console.log('Got a POST request');
	});

	app.post('/participants', function (req, res) {
  		console.log('Got a POST request');
	});

	app.route('/participants/:cid/:offset?')
	    .get(parti.listAllByCID)
};
