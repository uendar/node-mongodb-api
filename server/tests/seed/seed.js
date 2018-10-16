const {ObjectID}=require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const {SCK} = require('./../../../playground/file');

const todos = [{
    _id:new ObjectID(),
    text:'First Test'
},
{
    _id:new ObjectID(),
    text:'Sec Test',
    completed:true,
    completedAt:333
}];

const userID = new ObjectID();
const userTwo = new ObjectID();
const users = [{
    _id:userID,
   email:'enos@gmail.com',
   password:'enos@pass3',
   tokens:[{
       access:'auth',
       token:jwt.sign({_id:userID, access:'auth'}, SCK.key).toString()
   }]
},
{
    _id:userTwo,
    email:'e2nos@gmail.com',
    password:'enos@pass883',
}];

 const populateTodos = (done) =>{
    Todo.deleteMany({}).then(()=>{
        return Todo.insertMany(todos);
     }).then(()=>{ 
          done();
       });
 }


 const populateUsers = (done)=>{
     User.deleteMany({}).then(()=>{
         var userOne  = new User(users[0]).save();
         var userTwo = new User(users[1]).save();
         return   Promise.all([userOne, userTwo])
     }).then(()=>{
         done();
     })
 }


 module.exports={populateTodos, todos, populateUsers, users}