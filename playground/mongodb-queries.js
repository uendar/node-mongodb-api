const { ObjectID} = require('mongodb');
const {mongoose}  = require('./../server/db/mongose');

const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id ="5ba8bce2f42bdcdc8527c71e";
var userId='5ba4bf4ae44e8f5051d109f7';

if(!ObjectID.isValid(id)){
    console.log("ID not valid!");
}else{
    console.log("ID  valid!");
   // return id;
}



// Todo.find({
//     _id:id
// }).then((todos)=>{
//     console.log("TODOS", todos);
// });


// Todo.findOne({
//     _id:id
// }).then((todo)=>{
//     console.log("TODOS", todo);
// });


// Todo.findById(id).then((todo)=>{
//     if(!todo){
//    return console.log("Id not found!");
//     }
//     console.log("TODOS", todo);
// }).catch((e)=>{console.log(e)});





User.find({
    _id:userId
}).then((users)=>{
    console.log("User", users);
});



User.findOne({
    _id:userId
}).then((user)=>{
    console.log("User", user);
});


User.findById(userId).then((user)=>{
    if(!user){
   return console.log("Id not found!");
    }
    console.log("User", user);
}).catch((e)=>{console.log(e)});



