const bcrypt = require('bcrypt')
const mongoose = require("mongoose");
const {ObjectId}= mongoose.Schema;

const userSchema = new  mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required : true
    },
    email : {
        type : String,
        trim : true,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    created : {
        type : Date,
        default : Date.now
    },
    photo : {
        data : Buffer,
        contentType : String
    },
    updated  : Date,
    about : {
        type : String,
        trim : true
    },
    following : [{type:ObjectId,ref: "User"}],
    followers : [{type:ObjectId,ref: "User"}],
    resetPasswordLink: {
        data: String,
        default: ""
    }

})

// Crypt Before Save

userSchema.pre('save', function(next){
    const user = this ;
    bcrypt.hash(user.password,5,function(error,encrypted){
        user.password = encrypted ;
        next();
    })
})




module.exports = mongoose.model('User',userSchema)