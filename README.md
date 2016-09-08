# gulp-less-json-import

This is a gulp preprocessor for the less compilation. It provides a directive **@json-import** to import variables 
defined in a json file.

It inject the Less formated data in place of the directive in the file buffer without writing it on disk.


## Usage

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


## Options

You can passe an option object to the lessJsonImport function.

- `{Function} nameFormatter` Override the variable name formatter. Take the path of the variable as `String[]` and may return the variable name as `String`.
By default the formatter do `path.join('-')`.
 

## Example

data.json
```javascript
{
  "color1": "#ff0000",
  "color2": "#00ff00",
  "font": "Helvetica",
  "border": {
    "type": "solid",
    "size": "1px",
    "color": "grey"
  }
}
```

style.less
```Less
@json-import "data.json";

body{
  color: @color1;
  background: @color2;
  font-family: @font;
}

table{
  td{
    border: @border-type @border-size @border-color
  }
}
```

generated style.css
```css
body {
  color: #ff0000;
  background: #00ff00;
  font-family: Helvetica;
}
table td {
  border: solid 1px grey;
}

```