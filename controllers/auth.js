const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const expressJwt = require ('express-jwt')
const User = require('../models/user')
const _ = require("lodash");
const { sendEmail } = require("../helpers");

exports.signup = async (req,res) => {
  const userExists = await User.findOne({email :req.body.email})
  if(userExists)
  return res.status(403).json({error : "Email is Taken!!"})

  const user = await new User(req.body)
  await user.save()
  .then(user => { res.json({message : "Signup Success! Please Login !"}) })
}

exports.signin = (req,res) => {
    // find the user based on email
    const {email,password} = req.body ;
    User.findOne({email},(error,user) => {
      // if user
      if(user){
        bcrypt.compare(password,user.password,(error,same) => {
          if(same){
              const token = jwt.sign({_id:user.id},process.env.JWT_SECRET);
              res.cookie("t",token,{expiresIn : 2});
              const {_id,name,email} = user;
              return res.json({token,user : {_id,name,email}});
          }else{
            return res.json({error : "Password is incorrect" })
          }
        })
      }
      else{
        return res.json({error : "User with that email is not Exist" })
      }
    })
}

exports.signout = (req,res) =>{
  res.clearCookie("t")
  return res.json({message : "Signout Success"})
}

exports.requireSignIn = expressJwt({
  // if token is valid , express jwt append verified user id in an auth key to the request object
  secret : process.env.JWT_SECRET,
  userProperty: 'auth'
})


exports.forgotPassword = (req,res) => {
  if (!req.body) return res.status(400).json({ message: "No request body" });
  if (!req.body.email)
      return res.status(400).json({ message: "No Email in request body" });

  // find the user based on email
  const {email} = req.body ;
  User.findOne({email},(err,user) => {
    if (err || !user)
    return res.status("401").json({
        error: "User with that email does not exist!"
    });
    const token = jwt.sign({_id:user.id,iss:"NODEAPI"},process.env.JWT_SECRET);

    // email data
      const emailData = {
          from: "noreply@node-react.com",
          to: email,
          subject: "Password Reset Instructions",
          text: `Please use the following link to reset your password: ${
              process.env.CLIENT_URL
          }/reset-password/${token}`,
          html: `<p>Please use the following link to reset your password:</p> <p>${
              process.env.CLIENT_URL
          }/reset-password/${token}</p>`
      };

      return user.updateOne({ resetPasswordLink: token }, (err, success) => {
        if (err) {
            return res.json({ message: err });
        } else {
            sendEmail(emailData);
            return res.status(200).json({
                message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
            });
        }
    });

  })
}

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  User.findOne({ resetPasswordLink }, (err, user) => {
      // if err or no user
      if (err || !user)
          return res.status("401").json({
              error: "Invalid Link!"
          });

      const updatedFields = {
          password: newPassword,
          resetPasswordLink: ""
      };

      user = _.extend(user, updatedFields);
      user.updated = Date.now();

      user.save((err, result) => {
          if (err) {
              return res.status(400).json({
                  error: err
              });
          }
          res.json({
              message: `Great! Now you can login with your new password.`
          });
      });
  });
};



exports.socialLogin = (req, res) => {
  // try signup by finding user with req.email
  let user = User.findOne({ email: req.body.email }, (err, user) => {
      if (err || !user) {
          // create a new user and login
          user = new User(req.body);
          req.profile = user;
          user.save();
          // generate a token with user id and secret
          const token = jwt.sign(
              { _id: user._id, iss: "NODEAPI" },
              process.env.JWT_SECRET
          );
          res.cookie("t", token, { expire: new Date() + 9999 });
          // return response with user and token to frontend client
          const { _id, name, email } = user;
          return res.json({ token, user: { _id, name, email } });
      } else {
          // update existing user with new social info and login
          req.profile = user;
          user = _.extend(user, req.body);
          user.updated = Date.now();
          user.save();
          // generate a token with user id and secret
          const token = jwt.sign(
              { _id: user._id, iss: "NODEAPI" },
              process.env.JWT_SECRET
          );
          res.cookie("t", token, { expire: new Date() + 9999 });
          // return response with user and token to frontend client
          const { _id, name, email } = user;
          return res.json({ token, user: { _id, name, email } });
      }
  });
};
