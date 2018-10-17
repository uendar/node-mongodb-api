const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require("bcryptjs");

const {SCK} = require('../../playground/file');


var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        unique:true,
        validate:{
            validator: validator.isEmail,           
            message:'{value} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength:6
    },
    tokens:[{
        access:{
            type:'String',
            required:true
        },
        token:{
            type:'String',
            required:true
        }
    }]

});

UserSchema.methods.toJSON = function (){

    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject,['_id', 'email']);

};

//method ->instance object
UserSchema.methods.generateAuthToken = function(){

    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(), access}, SCK.key).toString();

    user.tokens.push({access, token});
   // user.tokens.concat([{access, token}]);

    return  user.save().then(()=>{
        return token;
    });
}



UserSchema.methods.removeToken = function(token){
  var user = this;
  return user.update({
      $pull:{
          tokens:{token}
      }
  })
};

//static -> model object
UserSchema.statics.findByToken = function (token){
    var User = this;
    var decoded;

    try{
        decoded= jwt.verify(token, SCK.key);
    }catch (e){
         return Promise.reject('fail');
    }
 
    return User.findOne({
        '_id':decoded._id,
        'tokens.token' : token,
       'tokens.access': 'auth'
    })
}

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve, reject)=>{
            //compare pass and user pass
             bcrypt.compare(password, user.password, (err, res)=>{
                 if(res){
                    resolve(user);
                 }else{
                    reject();
                 }
             });
        });
    });
};



UserSchema.pre("save",function(next){
    var user = this;
  
    if(user.isModified('password')){
        //   console.log("MODIFIED")
            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(user.password, salt, function(err, hash){
                        user.password = hash;
                        next();     
                });
             });
    }else{
     //   console.log("NOT-MODIFIED")
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User
}
