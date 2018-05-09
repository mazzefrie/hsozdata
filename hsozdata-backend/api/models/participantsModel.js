'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ParticipantsSchema = new Schema({
  Name: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  CID: {
    type: Number,
    required: 'Kindly enter the name of the task'
  },
 
},{ collection: 'Participants' });




ParticipantsSchema.static('findByID', function (name, callback) {
  return this.find({ _id: name }, callback);
});

ParticipantsSchema.static('findByName', function (name, callback) {
  return this.find({ Person: name }, callback);
});

ParticipantsSchema.static('findByCID', function (name, callback) {
  return this.find({ CID: name }, callback);
});

module.exports = mongoose.model('Participants', ParticipantsSchema);