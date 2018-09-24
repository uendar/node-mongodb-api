var express = require('express');
var bodyParser = require('body-parser');
const { ObjectID} = require('mongodb');

var { mongoose} = require('./db/mongose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
   var todo = new Todo({
       text:req.body.text
   });
    todo.save().then((doc)=>{
      res.status(201).send(doc);
    },(err)=>{
        res.status(400).send(err);
    })
});;


app.get('/todos', (req, res)=>{
   
       Todo.find().then((todos)=>{
         res.status(200).send({todos});
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





app.listen(port, ()=>{
    console.log(`Started on port ${port}`)
})


module.exports={
    app
}