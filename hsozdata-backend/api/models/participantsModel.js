'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var ParticipantsSchema = new Schema({
  Name: {
    type: String,
    required: ''
  },
  CID: {
    type: Number,
    required: ''
  },
 
},{ collection: 'Participants' });


// Finde Person bei der "PID" über die Nodes
ParticipantsSchema.static('findByPID', function (name, callback) {
  return this.find({ Person: "person"+name }, callback);
});

// Über die MongoDB-ID
ParticipantsSchema.static('findByID', function (name, callback) {
  return this.find({ _id: name }, callback);
});

// Über den Namen
ParticipantsSchema.static('findByName', function (name, callback) {

    var t = this;
    this.count({"Person": name},function(err, c) {

        t.aggregate([
          { 
            "$match": { "Person": name } 
          },
          { 
            $lookup:{
                from:"Conferences",
                localField:"CID",
                foreignField:"CID",
                as:"conf"
            },            
          },          
          {
              $unwind: "$conf"
          },
            { 
                $lookup:{
                    from: "Nodes",
                    localField:"Person",
                    foreignField:"Label",
                    as:"node"
                }
            },
            {
              $unwind: "$node"
            },

          {
          $lookup:{
                from:"Communities",
                localField:"node.Id",
                foreignField:"PID",
                as:"comm"
            }
          },
          {
          $unwind: "$comm"
          },
          { "$addFields": { "count": c } }
          ],       
          function(err,task) {
            callback(err, c, task);
        });
      });
});

// Finde alle Teilnehmer einer Konferenz
ParticipantsSchema.static('findByCID', function (name, callback) {
   return this.aggregate([
          { 
            "$match": { "CID": parseInt(name) } 
          },

            { 
                $lookup:{
                    from: "Nodes",
                    localField:"Person",
                    foreignField:"Label",
                    as:"node"
                }
            },
            {
              $unwind: "$node"
            },

          {
          $lookup:{
                from:"Communities",
                localField:"node.Id",
                foreignField:"PID",
                as:"comm"
            }
          },
          {
          $unwind: "$comm"
          }
          ], callback);

//  find({ CID: name }, callback);
});

module.exports = mongoose.model('Participants', ParticipantsSchema);