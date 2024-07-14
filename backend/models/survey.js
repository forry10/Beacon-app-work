const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  age: String,
  gender: String,
  mentalHealth: String,
  talkToFriends: String,
  friendResponse: String,
  lightBeacon: String,
  friendBeacon: String,
  followInfluencers: String,
  tiredOfFake: String,
  downloadApp: String,
  colorScheme: String,
  appFeel: String,
  branding: String,
  email: String,
});

module.exports = mongoose.model('Survey', surveySchema);
