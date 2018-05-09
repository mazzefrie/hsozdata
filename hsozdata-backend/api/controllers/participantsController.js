'use strict'; 

var mongoose = require('mongoose'),
participants = mongoose.model('Participants');

exports.listAll = function(req, res) {
 participants.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  }).skip( parseInt(req.params.offset) ).limit(10);
};

exports.listOneByID = function(req, res) {
  participants.findByID(req.params.id, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });  
};

exports.listByName = function(req, res) {
  participants.findByName(req.params.name, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });  
};

exports.listAllByCID = function(req, res) {
  participants.findByCID(req.params.cid, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });  
};

