const { ObjectID} = require('mongodb');
const {mongoose}  = require('./../server/db/mongose');

const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


//removes all todos
// Todo.deleteMany({}).then((res)=>{
//     console.log(res);
// });

//removes one by id same as findOneAndRemove
// Todo.findOneAndDelete('5ba9f440612fb0dad512110b').then((doc)=>{
//      console.log(doc);
// },(err)=>{
//     console.log(err);
// });



Todo.findByIdAndDelete('5ba9f8a97f66351de445be5e').then((doc)=>{
         console.log(doc);
    },(err)=>{
        console.log(err);
    });
    
    