var expect = require("expect");
var request = require('supertest');
const {ObjectID}=require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} =require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


// beforeEach((done)=>{
//         Todo.find({}).then(()=>{
//             return Todo.find({});
//         });
// });

describe('POST /todos',()=>{

    it('create new todo', (done) => {
         var text = 'Test TODO text';
         request(app)
         .post('/todos')
         .send({text})
         .expect(200)
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
       .expect(201)
       .expect((res)=>{
           res = todos
           expect(res.length).toBe(2);
       })
       .end(done)
   });
});


describe('GET /todos/:id',()=>{

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


describe('DELETE /todos/:id',()=>{
  
    it('return deleted data',(done)=>{
        var hexId =  todos[1]._id.toHexString();
       request(app)
       .delete(`/todos/${hexId}`)
       .expect(200)
       .expect((res)=>{
           expect(res.body.todo._id).toBe(hexId);        
       })
       .end((err, res)=>{
           if(err){
               return done(err);
           }

           Todo.findById(hexId).then((res)=>{
             expect(res).toBeFalsy();
             done();
        }).catch((err)=> done(err));
       });
    });



     it('return 404 if id todo not found',(done)=>{

    var hexID = new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${hexID}`)
        .expect(404)
        .end(done);   
    });



    it('return 404 if id todos non-object ids',(done)=>{
        var id ="123";
        request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);        
    });
    
});


describe('PATCH /todos/:id' ,()=>{

 it('update todo',(done)=>{
    var hexID = todos[0]._id.toHexString();
    var text = "New test text";

     request(app)
     .patch(`/todos/${hexID}`)
     .send({
         completed:true,
         text
     })
     .expect(200)
     .expect((res)=>{
         expect(res.body.todo.text).toBe(text);
         expect(res.body.todo.completed).toBe(true);
         expect(typeof res.body.todo.completedAt).toBe('string');
     })
     .end(done);
 });


 it('clear completedAt when todo not completed',(done)=>{
    var hexID = todos[1]._id.toHexString();
    var text = "New test second text";

    request(app)
     .patch(`/todos/${hexID}`)
     .send({
         completed:false,
         text
     })
     .expect(200)
     .expect((res)=>{
         expect(res.body.todo.text).toBe(text);
         expect(res.body.todo.completed).toBe(false);
         expect(res.body.todo.completedAt).toBeNull();
     })
     .end(done);
});

});



describe('GET /users/api', ()=>{

    it("return user if authenticated", (done)=>{
        request(app)
        .get('/users/api')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it("return 401 if not authenticated", (done)=>{
        request(app)
        .get('/users/api')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});


describe("POST /users",()=>{

 it("should create a user", (done)=>{
       var email = "alo@gmauil.com"
       var password="2313@@#@fa"

       request(app)
       .post('/users')
       .send({email, password})
       .expect(200)
       .expect((res)=>{
           expect(res.header['x-auth']).toBeTruthy();
           expect(res.body._id).toBeTruthy();
           expect(res.body.email).toBe(email);
       }).end((err)=>{
            if(err){
              return done(err);
            }
                User.findOne({email}).then((user)=>{
                   expect(user).toBeTruthy();
                   expect(user.password).not.toEqual(password);
                   done();
                });
        })
 });


 it("should return validation error if req invalid", (done)=>{
    var email = "alo.com"
    var password="23"

    request(app)
    .post('/users')
    .send({email, password})
    .expect(404)
    .end(done)

});


it("should not create a user if email in use", (done)=>{
        request(app)
        .post('/users')
        .send({
            email:users[0].email,
            password:'passs2342342fSD@'
            })
        .expect(404)
        .end(done)
    })
});
