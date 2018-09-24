var expect = require("expect");
var request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');


const todos = [{
    text:'First Test'
},
{
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



describe('GEt /todos',()=>{
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