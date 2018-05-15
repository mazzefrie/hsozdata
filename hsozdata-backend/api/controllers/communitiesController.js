'use strict'; 

var mongoose = require('mongoose');
var tfidf = mongoose.model('Conferences');
var topicmodel = mongoose.model('CommunityTopics');
var community = mongoose.model('Communities');


exports.listAll = function(req, res) {
 community.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  }).skip( parseInt(req.params.offset) ).limit(10);
};


exports.listTopicyByClass = function(req, res) {

};

exports.requestTFIDF = function(req, res) {
  tfidf.findByCommunity(req.params.classid, function(err, community) {

    // Extract the TFIDF from the MongoArray
    var target = [];
    community.forEach(function(com,i){
      var tfidfModel = com.tfidf.ftfidf_model;
      tfidfModel.forEach(function(element) {
        target.push([element.id,element.model])
      });
    });


    // Add wheights of multiple words
    var uniqs = target.reduce((acc, val) => {
      acc[val[0]] = acc[val[0]] === undefined ? val[1] : acc[val[0]] += val[1];
      return acc;
    });

    // Filter to show only weights greater than..
    var filtered = Object.keys(uniqs).filter(result => uniqs[result] >= 2)
        .reduce((obj, key) => {
          obj[key] = uniqs[key];
          return obj;
        }, {});


    if (err)
      res.send(err);
    res.json(filtered);
  });
};


exports.requestTags = function(req, res) {
 community.requestTags(req.params.classid, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.listByClass = function(req, res) {

	if(!req.params.offset)
		req.params.offset = 0 

	community.findByClass(
		[req.params.classid,req.params.offset,req.query.filterBy], 
		function(err, result) {
	    
		    if (err)
		      res.send(err);
		    res.json(result)
  		}
  	);  
};