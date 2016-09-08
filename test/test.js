var gulp = require('gulp');
var less = require('gulp-less');
var lessJsonImport = require('../index');

gulp.src(['*/style.less'])
    .pipe(lessJsonImport())
    .pipe(less())
    .pipe(gulp.dest(__dirname + '/dist'));