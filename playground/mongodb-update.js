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

    //update mongo object
    // db.collection("Todos").findOneAndUpdate({
    //     _id: new ObjectID("5ba262d17f66351de445bdc2")
    // }, {
    //     $set: {
    //         complleted: true
    //     }
    // }, {
    //     returnOriginal: false

    // }).then((resp) => {
    //     console.log(resp);
    // }, (e) => {
    //     console.log(e)
    // })


    db.collection("Users").findOneAndUpdate({
        _id: new ObjectID("5ba25ece7e09704205c2e3ed"),
    }, {
        $set: {
            name: "Nacut"
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((resp) => {
        console.log(resp);
    }, (e) => {
        console.log(e);
    })






    // client.close();
})
