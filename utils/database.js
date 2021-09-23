const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    MongoClient.connect('mongodb://localhost:27017/complete-node', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(res => {
            console.log('mongo connected');
            _db = res.db('complete-node');
            callback();
        }).catch(err => {
            console.log(err);
            throw err;
        });
};


const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'no databse found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

