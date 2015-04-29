/**
 * Плагин для Gulp компилирующий flash
 * Created by Mu57Di3 on 27.04.2015.
 */

'use strict';

var PLUGIN_NAME = 'gulp-flbuild';

var through = require('through2');
var gutil   = require('gulp-util');
var fs      = require('fs');
var path    = require('path');
var File    = require('vinyl');
require('shelljs/global');

var PluginError = gutil.PluginError;

module.exports = function (opt){

    var gulpFlbuild = function (file, enc, cb){
        if (file.isNull()) return cb(null, file);
        if (file.isStream()) return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));


        if (opt==null || opt.output==null) return cb(new PluginError(PLUGIN_NAME, 'Config empty'));

        opt.FLEX_HOME = path.resolve(opt.FLEX_HOME);
        opt.PROJECT_HOME = path.resolve(opt.PROJECT_HOME);

        var req = [
            '"'+path.join(opt.FLEX_HOME,'/bin/mxmlc.exe')+'"',
            file.path
        ];


        if (opt.libraryDirectory !== null && opt.libraryDirectory.length>0){
            for (var i= 0,cnt=opt.libraryDirectory.length;i<cnt;i++){
                var t = opt.libraryDirectory[i];
                t = t.replace('$PROJECT_HOME',opt.PROJECT_HOME);
                var list = ls(t+'/*.swc');
                if (list.length>0){
                    for(var j= 0,cntj=list.length;j<cntj;j++){
                        req.push('-library-path "'+list[j]+'"');
                    }
                }
            }
        }

        if (opt.sourceDirectory !== null){
            opt.sourceDirectory = opt.sourceDirectory.replace('$PROJECT_HOME',opt.PROJECT_HOME);
            req.push('-source-path "'+opt.sourceDirectory+'"');
        }

        if (opt.args !== null && opt.args.length>0){
            for (var i= 0,cnt=opt.args.length;i<cnt;i++){
                req.push(opt.args[i]);
            }
        }

        opt.output = opt.output.replace('$PROJECT_HOME',opt.PROJECT_HOME);
        req.push('-output "'+opt.output+'"');

        req = req.join(' ');
        var res = exec(req, {silent:true});

        if (res.code==0){
            console.log(res.output);
        } else {
            return cb(new PluginError(PLUGIN_NAME, "Project compile fail:\n"+res.output));
        }


        var outFile = new  File({
             cwd: "/",
             base: path.join(opt.PROJECT_HOME,'/out'),
             path: opt.output,
             contents: fs.readFileSync(opt.output)
         });

        cb(null,outFile);
    };



    return through.obj(gulpFlbuild);
};
