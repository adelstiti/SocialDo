require('dotenv').config();
const cors = require("cors");
const express = require("express");
const morgan = require('morgan');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require('fs')
const fileupload = require('express-fileupload')
const path = require('path');

const app = express()

// bring in routes
const routerPost = require('./routes/post')
const routerAuth = require('./routes/auth')
const routerUser = require('./routes/user')

// ApiDocs
app.get("/api-docs",(req,res) =>{
  fs.readFile('docs/apiDocs.json',(err,data) => {
    if(err){res.status(400).json({err})}
    const docs = JSON.parse(data);
    res.json(docs);
  })
});

mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true,useUnifiedTopology: true })
.then(() => console.log('DB Connected'))

mongoose.connection.on('error',err => {
    console.log(`DB connection error : ${err.message}`)
})


// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors());
app.use("/api",routerPost);
app.use("/api",routerAuth);
app.use("/api",routerUser);
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({error : 'invalid token...'})
    }
  });

// Serve Static Assets if in production
if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));

  app.get('*',(req,res) => {
      res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  } )
}

const port = process.env.PORT || 5000 ;
app.listen(port, () => {console.log(`Server running on port ${port}`)});