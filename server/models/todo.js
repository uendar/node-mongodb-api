var mongoose = require('mongoose');


//create model ...
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Date,
        default: null

    },
    _creator:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
    }
});


module.exports = {
    Todo
}
