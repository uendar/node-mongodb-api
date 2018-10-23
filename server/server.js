
require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID} = require('mongodb');
const SHA256 = require('crypto-js/sha256');

var {mongoose} = require('./db/mongose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

//TODOS
app.post('/todos', authenticate, (req, res)=>{
   var todo = new Todo({
       text:req.body.text,
       _creator:req.user._id
   });
    todo.save().then((doc)=>{
      res.status(200).send(doc);
    },(err)=>{
        res.status(400).send(err);
    })
});

app.get('/todos',authenticate, (req, res)=>{

    
       Todo.find({_creator:req.user._id}).then((todo)=>{
         res.status(201).send({todo})
       },(err)=>{
        res.status(400).send(err);
       });
});

app.get('/todos/:id',authenticate,(req, res)=>{
  var id = req.params.id;

    if(!ObjectID.isValid(id)){
       return  res.status(404).send({message: 'id not existing'});
    }

        Todo.findOne({
            _id:id,
            _creator : req.user._id
        }).then((todo)=>{
         if(!todo){
             return res.status(404).send({message: 'No items with that id'});
         }
        res.status(201).send({todo}); 
    }).catch((err)=>{
        res.status(404).sstatus({message: 'id not found'});
    });

});


app.delete('/todos/:id',authenticate, (req, res)=>{

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

     Todo.findOneAndDelete({_id:id, _creator: req.user._id}).then((todo)=>{
            if(!todo){
                return res.status(404).send({message:'No items with that id'})
            }
            res.status(200).send({todo});
     }).catch((err)=>{
        res.status(404).status({message: 'id does not exists!'});
     })

});

//patch used when update 
app.patch('/todos/:id', authenticate, (req, res)=>{
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


    Todo.findOneAndUpdate({_id:id, _creator:req.user._id}, {$set:body}, {new:true}).then((todo)=>{

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


//req auth valid tok, assosiet user, send user back
app.get('/users/api', authenticate, (req, res)=>{
    res.send(req.user);
});
//OR without middleware
// app.get('/users/api', (req, res)=>{
//     var token = req.header('x-auth');

//     User.findByToken(token).then((user)=>{
//         if(!user){
//            return Promise.reject();
//         }
//         res.send(user);

//     }).catch((e)=>{
//        res.status(401).send(e);
//     });
// });

app.post('/users/login', (req, res)=>{
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
      user.generateAuthToken().then((token)=>{
          res.header('x-auth', token).send({
              user:user,
              token:user.tokens[0].token})
      })
   }).catch((e)=>{
        res.status(400).send();
   });

});


app.delete('/users/api/token', authenticate, (req, res)=>{
   
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    },()=>{
        res.status(400).send();
    });
});


app.listen(port, ()=>{
    console.log(`Started on port ${port}`)
})


module.exports={
    app
}