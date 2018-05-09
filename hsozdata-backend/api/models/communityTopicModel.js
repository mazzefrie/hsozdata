'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommunityTopicSchema = new Schema({
  class_id: {
    type: Number,
    required: 'Kindly enter the name of the task'
  },
  CID: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  cid_model: {
    type: String,
    required: 'Kindly enter the name of the task'  	
  }
 
},{ collection: 'CommunityTopics' });

CommunityTopicSchema.static('findByCID', function (name, callback) {
  return this.find({ CID: name }, callback);
});

CommunityTopicSchema.static('findByClass', function (name, callback) {
  return this.find({ Class: name }, callback);
});


module.exports = mongoose.model('CommunityTopics', CommunityTopicSchema);