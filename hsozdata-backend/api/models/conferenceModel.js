'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ConferencesSchema = new Schema({
  Title: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  CID: {
    type: Number,
    required: 'Kindly enter the name of the task'
  },
  Community: {
    type: Number,
    required: 'Kindly enter the name of the task'
  },
  Count: {
    type: Number,
    required: 'Kindly enter the name of the task'
  },
  Epoche: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  Thema: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  StartDate: {
    type: Date,
    default: Date.now
  },
  EndDate: {
    type: Date,
    default: Date.now
  },

},{ collection: 'Conferences' });

ConferencesSchema.static('findByCID', function (name, callback) {
  return this.find({ CID: name }, callback);
});

module.exports = mongoose.model('Conferences', ConferencesSchema);