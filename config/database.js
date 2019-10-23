if(process.env.NODE_ENV === 'production'){
  module.exports = 'mongodb+srv://rasel:123@cluster0-chlsi.mongodb.net/test?retryWrites=true&w=majority'
} else {
  module.exports = 'mongodb://localhost/story-book'
}