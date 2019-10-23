const LocalStrategey = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const User = require('../model/user')



//. Load User model 
module.exports = function(passport){
  passport.use(new LocalStrategey(

    { usernameField: 'email' },
    async ( email, password, done)=>{
      let user = await User.findOne({email: email})
      let isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch){        
        return done(null, false, { message:"Password Not Matched......"})
      }
      return done(null,  user)      
    }
  ))

  passport.serializeUser(function(user, done){
    done(null, user.id)
  })
  passport.deserializeUser(function(id, done){
    User.findById(id, (err, user)=>{
      done(err, user)
    })
  })
}
