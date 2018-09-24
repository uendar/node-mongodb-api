var expect = require("expect");
var request = require('supertest');
const {ObjectID}=require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');


const todos = [{
    _id:new ObjectID(),
    text:'First Test'
},
{
    _id:new ObjectID(),
    text:'Sec Test'
}];

beforeEach((done)=>{
  Todo.deleteMany({}).then(()=>{
     return Todo.insertMany(todos);
     
  }).then(()=>{ done()});
});

describe('POST /todos',()=>{
    it('create new todo', (done) => {
         var text = 'Test TODO text';
         request(app)
         .post('/todos')
         .send({text})
         .expect(201)
         .expect((res)=>{
             expect(res.body.text).toBe(text);
         })
         .end((err, res)=>{
           if(err){
            return  done(err);
           }
       
            Todo.find({text}).then((res)=>{
            expect(res.length).toBe(1);
            expect(res[0].text).toBe(text);
            done();
            }).catch((e)=>{
                done(e);
            });
         });

        });

    it('Error creating todos', (done)=>{
       request(app)
        .post('/todos')
        .send({})
        .expect(400) 
        .end((err, resp)=>{
            if(err){
                return done(err);
            }

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((e)=>done(e));
        }) 
    }) ;  
});



describe('GET /todos',()=>{
   it('get all todos', (done)=>{
       request(app)
       .get('/todos')
       .expect(200)
       .expect((res)=>{
           expect(res.body.todos.length).toBe(2);
       })
       .end(done)
   });
});


describe('GET /todos/id',()=>{

    it('return todo by id',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(201)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });


    it('return 404 if id todo not found',(done)=>{
        var hexID = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hexID}`)
        .expect(404)
        .end(done);
        // .end((err, res)=>{
        //      if(err){
        //          return done(err);
        //      }
        // });
    });


    
    it('return 404 if id todos non-object ids',(done)=>{
     var id ="123";
     request(app)
     .get(`/todos/${id}`)
     .expect(404)
     .end(done);
    //  .end((err, res)=>{
         
    //     if(err){
    //         return done(err);
    //     }
    //  });

    });
});