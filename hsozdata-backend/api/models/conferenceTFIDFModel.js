'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConferenceTFIDFSchema = new Schema({
  ftfidf_model: {
    type: Number,
    required: ''
  },
  cid: {
    type: String,
    required: ''
  },
  ftfidf_model: {
    type: Array,
    required: ''  	
  }
 
},{ collection: 'ConferenceTFIDF' });

ConferenceTFIDFSchema.static('findByClass', function (name, callback) {
  return this.find({ CID: name }, callback);
});

module.exports = mongoose.model('ConferenceTFIDF', ConferenceTFIDFSchema);