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

    // db.collection('Todos').find({_id:new ObjectID('5ba0bce8d5b41f2eed760ebe')}).toArray().then((docs)=>{
    //  console.log('Todos');
    //  console.log(JSON.stringify(docs, undefined, 2));
    // },(err)=>{
    //    console.log('ERR', err);
    // });

//   db.collection('Todos').find().count().then((count)=>{
//      console.log(`Todos counts: ${count}`);
//      console.log(JSON.stringify(docs, undefined, 2));
//     },(err)=>{
//        console.log('ERR', err);
//     });

   db.collection('Users').find({name:'ENO'}).toArray().then((res)=>{
       console.log(res)
   }, (err)=>{
       console.log(err)
   })

   // client.close();
})
