const Post = require('../models/post')
const _ = require('lodash')
const formidable = require('formidable')
const fs = require('fs')


exports.postById = async (req,res,next,id) => {
  await Post.findById(id)
  .populate("postedBy" , "_id name")
  .populate("comments.postedBy" , "_id name")
  .exec((err,post) => {
    if(err){
      return res.status(400).json({error : "Post Not Found"})
  }
  req.post = post // add Post object in req with user info
  next();
  })
}


exports.getPosts = async (req, res) => {
    try {
      const posts = await Post.find()
      .populate('postedBy', '_id name')
      .populate('comments', 'text created')
      .populate('comments.postedBy', '_id name')
      .sort({created : -1})
      res.json(posts);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
    // OR
  //   const posts = Post.find()
  //   .then( posts => {
  //     res.json({posts})
  //   }
  //   )
  //   .catch(err => console.log(err))
  
}

exports.createPost = (req,res,next) => {
  const form = new formidable.IncomingForm()
  form.keepExtensions = true ;
  form.parse(req, (err,fields,files) => {
    if(err){
      return res.status(400).json({error:'Image Could not be uploaded'})
    }
    let post = new Post(fields)
    req.profile.password = undefined ;
    post.postedBy = req.profile
    if(files.photo){
      post.photo.data = fs.readFileSync(files.photo.path)
      post.photo.contentType = files.photo.type
    }
    post.save((err,result) => {
      if(err){
        return res.status(400).json({err})
      }
      res.json({result})
    })
  })
}

exports.postByUser = async (req,res) => {
    try {
      const posts = await Post.find({postedBy : req.profile})
      .populate("postedBy" , '_id name')
      .sort({created : -1})
      res.json({posts});
  } catch (err) {
      console.error(err.message);
      res.status(400).json({error:err})
  }
}

exports.isPoster = (req,res,next)=>{
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id

  console.log(req.auth)
  if(!isPoster){
    return  res.status(403).json({error:'User is not authorized'})
  }
  next();
}

exports.deletePost = (req,res) => {
  let post = req.post;
  if (!post) return res.status(404).json({ msg: 'Post not found' });
  post.remove((err,deleted)=>{
    if(err){
      res.status(400).json({err});
  }
  res.json({ msg: 'Post removed Succesfully' });
  })
}

// exports.updatePost =  (req,res) =>{
//   let post = req.post;
//   post = _.extend(post,req.body)
//   post.updated = Date.now()
//   post.save(err => {
//     if(err){
//       return res.status(400).json({error:err})
//     }
//     res.json(post)
//   })
// }

exports.updatePost = (req,res,next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true ; 
  form.parse(req, (err,fields,files) => {
      if (err) {
          return res.status(400).json({  error: "Photo Could not be uploaded"  });
      }
      let post = req.post ;
      post = _.extend(post, fields); // extend - mutate the source object
      post.updated = Date.now();
      if(files.photo){
        post.photo.data = fs.readFileSync(files.photo.path);
        post.photo.contentType = files.photo.type;
      }
      post.save((err) => {
          if (err) {
              return res.status(400).json({ error: err });
          }
          res.json(post);
      });


  })
}

exports.postPhoto = (req,res,next)=>{
    if(req.post.photo.data){
        res.set(("Content-Type" , req.post.photo.contentType));
        return res.send(req.post.photo.data);
    }
    next();
}


exports.singlePost = (req,res) =>{
  return res.json(req.post);
}


exports.like = (req,res) => {
  Post.findByIdAndUpdate(req.body.postId,{$push : {likes : req.body.userId}},{new : true} )
  .exec((err,result)=> {
      if(err){
          return res.status(400).json({error:err})
      }
      res.json(result);
  })
}


exports.unlike = (req,res) => {
  Post.findByIdAndUpdate(req.body.postId,{$pull : {likes : req.body.userId}},{new : true} )
  .exec((err,result)=> {
      if(err){
          return res.status(400).json({error:err})
      }
      res.json(result);
  })
}


exports.comment = (req,res) => {
  comment = req.body.comment ;
  comment.postedBy = req.body.userId ;

  Post.findByIdAndUpdate(req.body.postId,{$push : {comments : comment}},{new : true} )
  .populate('comments.postedBy' , '_id name')
  .populate("postedBy","_id name")
  .exec((err,result)=> {
      if(err){
          return res.status(400).json({error:err})
      }
      res.json(result);
  })
}



exports.uncomment = (req,res) => {
  let comment = req.body.comment ;
  Post.findByIdAndUpdate(req.body.postId,{$pull : {comments : {_id : comment._id}}},{new : true} )
  .populate('comments.postedBy' , '_id name')
  .populate("postedBy","_id name")
  .exec((err,result)=> {
      if(err){
          return res.status(400).json({error:err})
      }
      res.json(result);
  })
}

