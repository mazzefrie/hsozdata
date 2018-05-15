'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommunitiesSchema = new Schema({
  Class: {
    type: Number,
    required: ''
  },
  PID: {
    type: String,
    required: ''
  },
  Count: {
    type: Number
  }
 
},{ collection: 'Communities' });

CommunitiesSchema.static('findByPID', function (name, callback) {
  return this.find({ PID: name }, callback);
});

CommunitiesSchema.static('requestTags', function (params, callback) {
  return this.aggregate([
                {   
                "$match": 
                  { 
                    "Class": parseInt(params),
                    "PID":{ $regex: new RegExp('^conf') } 
                  },
                },
                {
                  $lookup:{
                    from: "Conferences",
                    localField:"PID",
                    foreignField:"CIDn",
                    as:"conf"
                  },
                },
                { $unwind: "$conf"},
                { $project : { _id: 0, "conf.Thema":1,"conf.Epoche":1 }}
        ],callback);
});


CommunitiesSchema.static('findByClass', function (params, callback) {

  var t = this;

  this.count({"Class": parseInt(params[0])},function(err, c) {

        var value_match = new RegExp();
        if (params[2] == "conf" || params[2]=="person")
            var value_match = new RegExp('^'+params[2]);

        t.aggregate([
            {   
                "$match": { 
                  "Class": parseInt(params[0]),
                  "PID":{ $regex: value_match } 
                } 
            },
            
            { "$skip" : parseInt(params[1]) },
            { "$limit": 10 },
            { "$addFields": { "count": c } },
            { 
            $lookup:{
                    from: "Nodes",
                    localField:"PID",
                    foreignField:"Id",
                    as:"node"
                }
            },
            {
              $unwind: "$node"
            },
            {
            $lookup:{
                    from: "Conferences",
                    localField:"PID",
                    foreignField:"CIDn",
                    as:"conf"
                }
            },
            
            ], 
        function(err,task) {
            callback(err, task);
        });
  });
});

module.exports = mongoose.model('Communities', CommunitiesSchema);