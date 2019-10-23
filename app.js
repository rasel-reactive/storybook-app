const http = require("http");
const path = require("path");
const mongoose = require('mongoose')
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash')
const passport = require('passport')


// Registered Routes
const authRoutes = require('./routes/auth')
const storyRoutes = require('./routes/stories')

// Passport Config
const Passport = require('./config/passport')
Passport(passport)


const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ejs view engine middleware
app.set("view engine", "ejs");
app.set("views", "views");
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "FFFFFFFFFFFF",
  store: new MongoDBStore({
    uri: 'mongodb://localhost/story-book',
    collection: 'session'
  }),
}))

//Passport Middlewares
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// Global Variable...........
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg')[0];
  res.locals.error_msg = req.flash('error_msg')[0];
  res.locals.passport_error = req.flash('error')[0];
  res.locals.user = req.user || undefined;
  res.locals.isLogged = req.user ? true : false
  next()
})


//! This Middlewere intead word passport
// app.use((req, res, next)=>{
//   if(req.session.isLogged){
//     req.user === set by passport
//     req.user = req.session.userId
//     req.isLogged = true
//   }
//   req.error = req.session.error 
//   next()
// })


app.use('/auth', authRoutes)
app.use('/stories', storyRoutes)

app.use('/', (req, res, next)=>{
  res.redirect('/stories')
  next()
})

//! Redirect Not Found Page 
// app.use((error, req, res, next)=>{
//   const status = error.statusCode || 500
//   const message = error.message
//   console.log(message);  
//   res.redirect('404')
// })


const port = process.env.PORT || 4000;
const server = http.createServer(app);

mongoose.connect('mongodb://localhost/story-book', {useNewUrlParser: true},)
.then(res=>{
  console.log('DB Connected');
  server.listen(port, function() {
    console.log(`server is running on port ${port}`);
  });
})

