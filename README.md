# gulp-less-json-import

This is a gulp preprocessor for the less compilation. It provide a directive **@json-import** to import variables 
defined in a json file.

It inject the Less formated data in place of the directive in the file buffer without write it on disk.

## Exemple

In less
```Less
@json-import "../relative/path.json";
@json-import "../relative/path/extOmit";
```

In gulp
```javascript
var gulp = require('gulp');
var less = require('gulp-less');
var lessJsonImport = require('gulp-less-json-import');

gulp.src(['./less/**/*.less', '!./less/**/_*.less'])
    .pipe(lessJsonImport())
    .pipe(less())
    .pipe(gulp.dest('./css'));
```