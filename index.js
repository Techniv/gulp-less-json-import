'use strict';

var NAME = 'gulp-less-json-import';

var through2        = require('through2');
var gutil           = require('gulp-util');
var StringDecoder   = require('string_decoder').StringDecoder;
var Buffer = require('buffer').Buffer;
var path            = require('path');
var fs              = require('fs');

var PluginError    = gutil.PluginError;

var importMatcher = /^\s?@json-import "(.*?)";/;

module.exports = function () {
    return through2.obj(function(file, encoding, callback){
        
        if(file.isStream()){
            return callback(new PluginError(NAME, 'Stream mode not supported'));
        }
        
        var decoder = new StringDecoder(encoding);
        var fileDir = path.dirname(file.path);

        var content = decoder.write(file.contents).split('\n');

        for(var i = 0; i < content.length; i++){
            var match = importMatcher.exec(content[i]);
            if(!match) continue;

            var jsonPath = path.resolve(path.join(fileDir, match[1]));

            if(path.parse(jsonPath).ext != '.json'){
                jsonPath += '.json';
            }

            var jsonContent = {};

            try{
                jsonContent = require(jsonPath);
            } catch (e){
                gutil.log(NAME, 'can\'t load "'+jsonPath+'"');
            }

            var lessContent = [];
            for(var key in jsonContent){
                lessContent.push('@');
                lessContent.push(key);
                lessContent.push(': ');
                lessContent.push(jsonContent[key]);
                lessContent.push(';\n');
            }

            content[i] = lessContent.join('');


        }

        file.contents = new Buffer(content.join('\n'));

        this.push(file);

        callback();
    });
};