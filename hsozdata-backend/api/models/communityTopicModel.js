'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommunityTopicSchema = new Schema({
  class_id: {
    type: Number,
    required: ''
  },
  CID: {
    type: String,
    required: ''
  },
  cid_model: {
    type: String,
    required: ''  	
  }
 
},{ collection: 'CommunityTopics' });

CommunityTopicSchema.static('findByCID', function (name, callback) {
  return this.find({ CID: name }, callback);
});

CommunityTopicSchema.static('findByClass', function (name, callback) {
  return this.find({ Class: name }, callback);
});


module.exports = mongoose.model('CommunityTopics', CommunityTopicSchema);