'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ConferencesSchema = new Schema({
  Title: {
    type: String,
    required: ''
  },
  CID: {
    type: Number,
    required: ''
  },
  Community: {
    type: Number,
    required: ''
  },
  Count: {
    type: Number,
    required: ''
  },
  Epoche: {
    type: String,
    required: ''
  },
  Thema: {
    type: String,
    required: ''
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


ConferencesSchema.static('findByCommunity', function (name, callback) {

  return this.aggregate([
                {   
                "$match": 
                  { 
                    "Community": parseInt(name),
                  },
                },
                {
                  $lookup:{
                    from: "ConferenceTFIDF",
                    localField:"CIDn",
                    foreignField:"cid",
                    as:"tfidf"
                  },
                },
                { $unwind: "$tfidf"},
   ],callback);
});

ConferencesSchema.static('findByCID', function (name, callback) {

  return this.aggregate([
                {   
                "$match": 
                  { 
                    "CID": parseInt(name),
                  },
                },
                {
                  $lookup:{
                    from: "ConferenceTFIDF",
                    localField:"CIDn",
                    foreignField:"cid",
                    as:"tfidf"
                  },
                },
                { $unwind: "$tfidf"},
        ],callback);

  //return this.find({ CID: name }, callback);
});

module.exports = mongoose.model('Conferences', ConferencesSchema);