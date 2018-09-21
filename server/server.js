var express = require('express');
var bodyParser = require('body-parser');


var { mongoose} = require('./db/mongose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
  // console.log(req.body);
   var todo = new Todo({
       text:req.body.text
   });
    todo.save().then((doc)=>{
      console.log(JSON.stringify(doc, undefined, 2));
      res.status(201).send(doc);
    },(err)=>{
        console.log(JSON.stringify(err, undefined, 2));
        res.status(400).send(err);
    })
});


app.get('/todos', (req, res)=>{
   
    
});





app.listen(3000, ()=>{
    console.log('Started on port 3000')
})