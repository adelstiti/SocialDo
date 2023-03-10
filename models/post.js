const mongoose = require("mongoose");
const {ObjectId}= mongoose.Schema;

const postSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    body:{
        type : String,
        required : true
    },
    photo : {
        data : Buffer,
        contentType : String
    },
    postedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true 
    },
    created : {
        type : Date,
        default : new Date()
    },
    updated  : Date,
    likes : [{type:ObjectId,ref: "User"}],
    comments : [
        {text:String,
        created: {type:Date,default:Date.now},
        postedBy: {type:ObjectId,ref: "User"}
        }
    ]

})

module.exports = mongoose.model('Post',postSchema)