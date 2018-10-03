const SHA256 = require('crypto-js/sha256');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const {SCK} = require('./file')


// var message = "Endari is nona 3!";

// var hash = SHA256(message).toString();

// console.log(message);
// console.log(hash);



// var data = {
//    id:4
// };

// var token={
// data,
// hash:SHA256(JSON.stringify(data)+ 'secretEn').toString()
// }

// token.data.id = 5;;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resHash = SHA256(JSON.stringify(data)+ 'secretEn').toString();

// console.log(resHash);
// console.log(token.hash);

// if(resHash === token.hash){
//     console.log('Not changed')
// }else{
//     console.log('changed')
// }

//-----------------------------------------





var data = {
   id:4
};


var token = jwt.sign(data, SCK.key);
//jwt.verify

console.log(token);


var unTok = jwt.verify(token, 'seCreTKEy@ENI',(err ,res )=>{
    if(err){
        console.log(err.message);
    }else{
        console.log(res);
    }
    
});

