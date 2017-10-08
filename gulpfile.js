var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify');

gulp.task('default', ['splat-js'], function () {
});

gulp.task('splat-js', function () {
  return gulp.src(['src/assets/js/spike.js', 'src/assets/js/spike-config.js'])
    .pipe(concat('spike.min.js'))
    .pipe(uglify("spike.min.js"))
    .pipe(gulp.dest('src/assets/js'))
})