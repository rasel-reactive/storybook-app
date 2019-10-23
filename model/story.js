const mongoose = require('mongoose')

const storySchema = new mongoose.Schema({
  title:{
    type:String,
    required: true
  },
  description:{
    type:String,
    required: true
  },
  status:{
    type:String,
    // required: true
  },
  allowComments:{
    type: Boolean,
    default: true
  },
  imageUrl:{
    type: String
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createAt:{ type:Date, default: Date.now },

  
  comments: [{
    commentBody:{type:String,required: true},
    createAt:{ type:Date, default: Date.now },
    createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }],
  likes:[{ 
    likes:{ type: Number },
    likedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likedAt:{ type:Date, default: Date.now },
  }],
}, {timestamps: true} )


module.exports = mongoose.model('Story', storySchema, 'stories')