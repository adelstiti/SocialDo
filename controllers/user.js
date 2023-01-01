const _ = require('lodash');
const User = require('../models/user')
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
const formidable = require('formidable')
const fs = require('fs')

exports.userById = (req,res,next,id) => {

    User.findById(id)
    .populate("following","_id name")
    .populate("followers","_id name")
    .exec((err,user) => {
        if(err){
            return res.json({error : "User Not Found"})
        }
        req.profile = user // add profil object in req with user info
        next();
    })
}

exports.hasAuthorization = (req,res,next) =>{
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id
    if(!authorized){
        return res.status(403).json({error:"User is not authorized to do this actionn"})
    }
}

exports.getUsers = (req,res) => {
    User.find((err,users)=>{
        if(err){
            console.error(err.message);
            res.status(500).send('Server Error');
        }
        res.json(users);
    })
}

exports.getUser = (req,res) =>{
    req.profile.password = undefined;
    return res.json(req.profile);
}

// exports.updateUser = (req, res, next) => {
//     let user = req.profile;
//     user = _.extend(user, req.body); // extend - mutate the source object
//     user.updated = Date.now();
//     user.save(err => {
//         if (err) {
//             return res.status(400).json({
//                 error: "You are not authorized to perform this action"
//             });
//         }
//        user.password = undefined ;
//         res.json({ user });
//     });
// };

exports.updateUser = (req,res,next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true ; 
    form.parse(req, (err,fields,files) => {
        if (err) {
            return res.status(400).json({  error: "Photo Could not be uploaded"  });
        }
        let user = req.profile ;
        user = _.extend(user, fields); // extend - mutate the source object
        user.updated = Date.now();
        if(files.photo){
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }
        user.save((err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            user.password = undefined ;
            res.json(user);
        });


    })
}

exports.userPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set(('Content-Type', req.profile.photo.contentType));
        return res.send(req.profile.photo.data);
    }
    next();
};

exports.deleteUser = (req,res) =>{
    let user = req.profile ;
    if (!user) return res.status(404).json({ msg: 'User not found' });
    user.remove((err,deleted) =>{
        if(err){
            res.status(400).json({err});
        }
        res.json({ msg: 'User removed Succesfully' });
    })
}

// Follow Unfollow

exports.addFollowing = (req,res,next) => {
    User.findByIdAndUpdate(req.body.userId,{$push : {following : req.body.followId}},(err,result) => {
        if(err){
            return res.status(400).json({error :err});
        }
        next();
    })
}

exports.addFollower = (req,res) => {
    User.findByIdAndUpdate(req.body.followId,{$push : {followers : req.body.userId}},{new : true} )
    .populate('following','_id name')
    .populate('followers','_id name')
    .exec((err,result)=> {
        if(err){
            return res.status(400).json({error:err})
        }
        result.password = undefined ;
        res.json({result});
    })
}


exports.removeFollowing = (req,res,next) => {
    User.findByIdAndUpdate(req.body.userId,{$pull : {following : req.body.unfollowId}},(err,result) => {
        if(err){
            return res.status(400).json({error :err});
        }
        next();
    })
}

exports.removeFollower = (req,res) => {
    User.findByIdAndUpdate(req.body.unfollowId,{$pull : {followers : req.body.userId}},{new : true} )
    .populate('following','_id name')
    .populate('followers','_id name')
    .exec((err,result)=> {
        if(err){
            return res.status(400).json({error:err})
        }
        result.password = undefined ;
        res.json({result});
    })
}

exports.findPeople = (req,res) =>{
    let following = req.profile.following ;
    following.push(req.profile._id);
    User.find({_id : {$nin : following}},(err,users) => {
        if(err){
            return res.status(400).json({error:err})
        }
        res.json(users)
    }).select('name')
}