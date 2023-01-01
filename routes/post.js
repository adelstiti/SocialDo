const express = require("express");
const {getPosts,createPost,postByUser,postById,isPoster,deletePost,updatePost,postPhoto,singlePost,like,unlike,comment,uncomment} = require('../controllers/post')
const validatorMiddleware = require('../validator');
const {requireSignIn} = require('../controllers/auth')
const { check} = require('express-validator');
const {userById} = require('../controllers/user')

const router = express.Router();

router.get("/posts",getPosts);

// Likes && Unlike
router.put('/post/like',requireSignIn,like)
router.put('/post/unlike',requireSignIn,unlike)

// Comments
router.put('/post/comment',requireSignIn,comment)
router.put('/post/uncomment',requireSignIn,uncomment)

router.post("/post/new/:userId",[
    check('title','Title Is Required').not().isEmpty(),
    check('title','Title must be between 4 to 150 characters').isLength({min:4,max:150}),
    check('body','Body Is Required').not().isEmpty(),
    check('body','Body must be between 4 to 2000 characters').isLength({min:4,max:2000})
],requireSignIn,createPost,validatorMiddleware);

router.get("/posts/by/:userId",requireSignIn,postByUser)
router.get("/post/:postId",singlePost)
router.delete("/post/:postId",requireSignIn,isPoster,deletePost)
router.put("/post/:postId",requireSignIn,isPoster,updatePost)
// PHOTO
router.get('/post/photo/:postId',postPhoto)

// any route containing :userid , our app will first excute userbyID()
router.param("userId",userById);

// any route containing :postId , our app will first excute postById()
router.param("postId",postById);

module.exports = router

