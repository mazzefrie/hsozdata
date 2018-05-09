'use strict'; 

var mongoose = require('mongoose'),
conference = mongoose.model('Conferences');

exports.listAll = function(req, res) {
 conference.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  }).skip( parseInt(req.params.offset) ).limit(10);
};


exports.listBy = function(req, res) {
  
  conference.findByCID(req.params.confid, function(err, task) {
    
    if (err)
      res.send(err);

    res.json(task);
  });  

};

