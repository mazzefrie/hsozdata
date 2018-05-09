'use strict'; 

var mongoose = require('mongoose');
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

exports.listByClass = function(req, res) {
	community.findByClass(req.params.classid, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });  
};