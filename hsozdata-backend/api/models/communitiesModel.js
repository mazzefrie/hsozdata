'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommunitiesSchema = new Schema({
  Class: {
    type: Number,
    required: 'Kindly enter the name of the task'
  },
  PID: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
 
},{ collection: 'Communities' });

CommunitiesSchema.static('findByPID', function (name, callback) {
  return this.find({ PID: name }, callback);
});

CommunitiesSchema.static('findByClass', function (name, callback) {
  return this.find({ Class: name }, callback);
});

module.exports = mongoose.model('Communities', CommunitiesSchema);