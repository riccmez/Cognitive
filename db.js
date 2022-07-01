
const mongoose = require('mongoose');

const MONGO_USERNAME = 'quality';
const MONGO_PASSWORD = 'quality234';
const MONGO_HOSTNAME = '127.0.0.1';
const MONGO_PORT = '27017';
const MONGO_DB = 'quality';

const options = {
    useNewUrlParser: true,
    wtimeoutMS: 2500,
    maxPoolsize:50,
};

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

mongoose.connect(url, options).then( function() {
  console.log('MongoDB is connected');
})
  .catch( function(err) {
  console.log(err);
});