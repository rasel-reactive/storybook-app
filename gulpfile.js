const gulp = require('gulp')
const sass = require('gulp-sass')


//. Compile Sass into Css Function
function style(){

  // src file
  // for maltiple file input and maltiple output
  return gulp.src('./scss/**/*.scss')

  // one input sass file
  // return gulp.src('./scss/main.scss')
  // pass sass my file through sass compiler
  .pipe(sass()).on('error', sass.logError)
  // output css file
  .pipe(gulp.dest('./public/style'))
}

function watch(){
  gulp.watch('./scss/**/*.scss', style)
}

exports.style = style
exports.watch = watch