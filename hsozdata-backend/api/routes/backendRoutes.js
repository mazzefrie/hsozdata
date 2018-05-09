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

	app.route('/conferences/:offset?')
	    .get(confi.listAll)

	app.route('/conference/:confid')
	    .get(confi.listBy)


	app.route('/participant/:name')
	    .get(parti.listByName)

	app.route('/participants/:cid/:offset?')
	    .get(parti.listAllByCID)

	app.route('/communities/:offset?')
	    .get(comm.listAll)

	app.route('/community/:classid')
	    .get(comm.listByClass)

	app.route('/community/topic/:classid')
	    .get(comm.listTopicyByClass)

};
