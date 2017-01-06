'use strict';

var NAME = 'gulp-less-json-import';

/**
 * @typedef
 * @name LessJsonImportOptions
 * @type Object
 * @property {NameFormatter} nameFormatter
 */

/**
 * @typedef
 * @name NameFormatter
 * @type Function
 * @param {String[]} path
 */


var through2        = require('through2');
var gutil           = require('gulp-util');
var StringDecoder   = require('string_decoder').StringDecoder;
var Buffer          = require('buffer').Buffer;
var path            = require('path');
var fs              = require('fs');

var PluginError    = gutil.PluginError;

var importMatcher = /^\s?@json-import "(.*?)";/;
/** @name {NameFormatter} defaultNameFormatter */
function defaultNameFormatter(path){
    return path.join('-');
};

/**
 * @param {LessJsonImportOptions} options
 */
module.exports = function (options) {
    var nameFormatter = defaultNameFormatter;
    if(options && options.nameFormatter) nameFormatter = options.nameFormatter;


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
            
            (function exploreJson(currentLevel, path, filePath){
                for(var key in currentLevel){
                    switch (typeof currentLevel[key]){
                        case 'object':
                            exploreJson(currentLevel[key], path.concat(key));
                            break;
                        default:
                            lessContent.push('@');
                            lessContent.push(nameFormatter(path.concat(key), filePath));
                            lessContent.push(': ');
                            lessContent.push(currentLevel[key]);
                            lessContent.push(';\n');
                    }
                }
            })(jsonContent, [], jsonPath);


            content[i] = lessContent.join('');


        }

        file.contents = new Buffer(content.join('\n'));

        this.push(file);

        callback();
    });
};
