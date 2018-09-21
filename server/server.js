var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

//create model ...

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    },
    completedAt: {
        type: Date

    }
});



// var newTodo = new Todo({
//     text: 'Cook dinner',
// });


// newTodo.save().then((doc) => {
//     console.log("Saved TODO", doc)
// }, (e) => {
//     console.log("Unable to save TODO")
// })


var otherTodo = new Todo({
    text: "Asigjo",
    completed: false,
    completedAt: Date.now()
});

otherTodo.save().then((doc) => {
    console.log("Saved TODO", JSON.stringify(doc, undefined, 2))
}, (e) => {
    console.log("Unable to save TODO", JSON.stringify(e, undefined, 2))
})
