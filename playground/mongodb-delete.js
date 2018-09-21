//const MongoClient = require('mongodb').MongoClient;
const {
    MongoClient,
    ObjectID
} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj)


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log("Unable to connect to MongoDB!");
    }
    console.log("Connected to MongoDB!");
    const db = client.db('TodoApp');

    //delete many
    // db.collection("Todos").deleteMany({
    //     text: 'drink coffe'
    // }).then((res) => {
    //     console.log(`Deletet ${res.deletedCount} objects with that property`);
    // }, (e) => {
    //     console.log(e);
    // });




    //delete one
    // db.collection("Todos").deleteOne({
    //     text: 'drink coffe'
    // }).then((res) => {
    //     console.log(`Deletet ${res.deletedCount} objects with that property`);
    // }, (e) => {
    //     console.log(e);
    // });





    //find one and delete
    // db.collection("Users").findOneAndDelete({
    //     name: "ENO"
    // }).then((result) => {
    //     console.log(result);
    // }, (e) => {
    //     console.log(e);
    // });





    // client.close();
})
