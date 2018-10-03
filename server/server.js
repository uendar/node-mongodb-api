
require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID} = require('mongodb');
const SHA256 = require('crypto-js/sha256');

var { mongoose} = require('./db/mongose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

//TODOS
app.post('/todos', (req, res)=>{
   var todo = new Todo({
       text:req.body.text
   });
    todo.save().then((doc)=>{
      res.status(200).send(doc);
    },(err)=>{
        res.status(400).send(err);
    })
});

app.get('/todos', (req, res)=>{
   
       Todo.find().then((todo)=>{
         res.status(201).send({todo})
       },(err)=>{
        res.status(400).send(err);
       });
});

app.get('/todos/:id',(req, res)=>{
  var id = req.params.id;

    if(!ObjectID.isValid(id)){
       return  res.status(404).send({message: 'id not existing'});
    }

    Todo.findById(id).then((todo)=>{
         if(!todo){
             return res.status(404).send({message: 'No items with that id'});
         }
        res.status(201).send({todo}); 
    }).catch((err)=>{
        res.status(404).sstatus({message: 'id not found'});
    });

});


app.delete('/todos/:id',(req, res)=>{

    //get the id
    //validate id ? true 200 :404
    //remove todo by id
      //success 
         //if no doc -> 404
         //if doc ->200
      //error -> 404

     var id  = req.params.id;

     if(!ObjectID.isValid(id)){
         return res.status(404).send({message:'id does not exists!'})
     }

     Todo.findByIdAndDelete(id).then((todo)=>{
            if(!todo){
                return res.status(404).send({message:'No items with that id'})
            }
            res.status(200).send({todo});
     }).catch((err)=>{
        res.status(404).status({message: 'id does not exists!'});
     })

});

//patch used when update 
app.patch('/todos/:id',(req, res)=>{
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
   
    if(!ObjectID.isValid(id)){
        return res.status(404).send({message:'id does not exists!'})
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt  = new Date().getTime();  
    }else{  
        body.completed = false;
        body.completedAt= null;
    }


    Todo.findByIdAndUpdate(id, {$set:body}, {new:true}).then((todo)=>{

        if(!todo){
          return res.status(404).send({message:'No items with that id'})
        }

        res.status(200).send({todo})

    }).catch((err)=>{
           res.status(404).send({message: 'id does not exists!'});
    });
});



//USERS
app.post('/users', (req, res)=>{
   var body = _.pick(req.body, ['email', 'password']);
   var user  = new User(body);

   user.save().then(()=>{ 
     return user.generateAuthToken();
    })
    .then((token)=>{
       var resp = user.toJSON();
        res.header('x-auth', token).send(resp);
    })
    .catch((err)=>{ 
        res.status(404).send(err)
    });

});







app.listen(port, ()=>{
    console.log(`Started on port ${port}`)
})


module.exports={
    app
}