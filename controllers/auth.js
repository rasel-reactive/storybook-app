const bcrypt = require("bcryptjs");
const Joi = require("@hapi/joi");
const passport = require('passport')

// const { validationResult } = require("express-validator");

const User = require("../model/user");

exports.signupPage = (req, res, next) => {
  let error = req.error;
  let errorMessage = {};
  if (error) {
    error.details.map(err => {
      errorMessage[err.path[0]] = err.message;
    });
  }

  res.render("auth/signup", {
    pageTitle: "Signup page",
    path: "/auth/signup",
    error: errorMessage,
    oldInput: { username: "", email: "", password: "", confirmPassword: "" }
  });
};


// //! Register Logic with express Validator..........
// exports.signup = async (req, res, next) => {

//   const { password, confirmPassword, email, username } = req.body;

//   try {
//     let result = validationResult(req);
//     let errorMessage = {}
//     if(!result.isEmpty()){
//       result.array().map(err=>{
//         errorMessage[err.param] = err.msg
//       });
//       let error = new Error('Error Occurred')
//         error.errorMessage = errorMessage
//         throw error
//     }

//     //- Here Other Success Logic
//     let hasedPass = await bcrypt.hash(password, 12)
//     let user = new User({
//       username,
//       email,
//       password: hasedPass
//     })
//     await user.save()
//     res.redirect('/auth/login')

//   } catch(ex){
//     console.log(ex);
//     res.render("auth/signup", {
//       pageTitle: "Signup page",
//       path: "/auth/signup",
//       isLogged: req.isLogged,
//       error: ex.errorMessage,
//       oldInput: { username, email, password, confirmPassword }
//     });
//   }

// };




//. Register Logic with Joi Validator............
exports.signup = async (req, res, next) => {
  const { password, confirmPassword, email, username } = req.body;

  const schema = Joi.object({
    username: Joi.string()
      .required()
      .min(3)
      .trim()
      .label('Username'),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .label('E-Mail'),
    password: Joi.string()
      .required()
      .label('Password'),
    confirmPassword: Joi.string()
      .required()
      .label('ConfirmPassword')
  });

  const option = { abortEarly: false };
  let { error } = schema.validate(req.body, option);
  
  try {
    if (error) {
      let createError = new Error();
      createError.error = error;
      throw createError;
    }

      //. Check Password Match or Not
      let passwordMatch = password === confirmPassword
      if(!passwordMatch){
      let details = []
        details.push({
          message: "Password doesn't match",
          path: ["confirmPassword"]
        });
        let copyError = {...error}
        copyError.details = details

        let createError = new Error();
        createError.error = copyError;
        throw createError;
    }

      //. Check User already Registered Or Not........
      let user = await User.findOne({ email: email });
      let details = []
      if (user) {
        details.push({
          message: "this email already register",
          path: ["email"]
        });
        let copyError = {...error}
        copyError.details = details

        let createError = new Error();
        createError.error = copyError;
        throw createError;
      }

      //. Password Hased...........
      let salt = await bcrypt.genSalt(12)
      let hasedPassword = await bcrypt.hash(password, salt);
      user = new User({
        username,
        email,
        password: hasedPassword
      });
      await user.save();
      req.flash('success_msg', 'You are Registered')
      res.redirect("/auth/login");

  } catch (ex) {
    let errorMessage = {};
    if (ex.error) {
      ex.error.details.reverse().map(err => {
        errorMessage[err.path[0]] = err.message;
      });
    }
    res.render("auth/signup", {
      pageTitle: "Signup page",
      path: "/auth/signup",
      error: errorMessage,
      oldInput: { username, email, password, confirmPassword }
    });
  }
};



exports.loginPage =  (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login page",
    path: "/auth/login",
    error: {},
    oldInput: { email: "", password: "" },
  });  
  
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .min(3)
      .required()
      .label("E-Mail"),
    password: Joi.string()
      .min(3)
      .required()
      .label("Password")
  });
  const option = { abortEarly: false };
  const { error } = schema.validate(req.body, option);

  try {
    if (error) {
      const customError = new Error();
      customError.error = error;
      throw customError;
    }

    let user = await User.findOne({email: email})
    if(!user){     
      let customError = { details: [{message:"this email not yet registered", path:['email']}] }        
      const newError = new Error();
      newError.error = customError;           
      throw newError  
    }

    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true,
    })(req, res, next)

    
    // Business Logic.............

  } catch (ex) {    
    // console.log(ex);
    let errorMessage = {};
    if(ex.error){
      ex.error.details.reverse().forEach(err => {
        errorMessage[err.path] = err.message;
      });
    }
    res.render("auth/login", {
      pageTitle: "Login Page",
      path: "/auth/login",             
      error: errorMessage,
      oldInput: { email: email, password: req.body.password }
    });
  }
};



exports.logOut = (req, res, next)=>{
  req.logout();
  req.flash('success_msg', "You are Logouted")
  res.redirect('/auth/login')
}


exports.getAllUser = async (req, res, next) => {
  try {
    res.send(await User.find());
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
