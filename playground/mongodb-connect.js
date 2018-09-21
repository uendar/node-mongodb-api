//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj)


MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log("Unable to connect to MongoDB!");
    }
    console.log("Connected to MongoDB!");

    const db = client.db('TodoApp');
    //add data to todo collection
    // db.collection('Todos').insertOne({
    //     text: "Clean",
    //     complleted: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Error on insert', err);
    //     }
    //     console.log("Data inserted successfully!", JSON.stringify(result.ops, undefined, 2));
    // })

    // db.collection("Users").insertOne({
    //     name: 'olas',
    //     age: 26,
    //     location: 'Albania, Durres'
    // }, (err, res) => {
    //     if (err) {
    //         return console.log('Error on insert', err);
    //     }
    //     console.log("Data inserted successfully!", JSON.stringify(res.ops[0]._id.getTimestamp(), undefined, 2));
    // })

    client.close();
})
