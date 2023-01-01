const express = require("express");
const {getUsers,userById,getUser,updateUser,deleteUser,userPhoto,addFollowing,addFollower,removeFollowing,removeFollower,findPeople} = require("../controllers/user")
const {requireSignIn} = require('../controllers/auth')

const router = express.Router();

router.put('/user/follow',requireSignIn,addFollowing,addFollower)
router.put('/user/unfollow',requireSignIn,removeFollowing,removeFollower)

router.get("/users", getUsers);

router.get('/user/:userId',requireSignIn,getUser)
router.put('/user/:userId',requireSignIn,updateUser)
router.delete('/user/:userId',requireSignIn,deleteUser)
router.get("/user/photo/:userId", userPhoto);

// Who to FOLLOW
router.get('/user/findpeople/:userId',requireSignIn,findPeople)

// any route containing :userif , our app will first excute userbyID()
router.param("userId",userById);

module.exports = router
