'use strict';
var removeHyphenReg = /[-]([a-zA-Z'-]+)/;
var matchHyphen = /-([a-z])/g;
var requireDir = require('require-dir-all');

function loader(folderPath, options) {
    var modules = requireDir(folderPath, {
        indexAsParent: true, 
        map: function (reqModule) {
            if (options.removeAfterHyphen) {
                reqModule.name = reqModule.name.split(removeHyphenReg)[0]; 
            } else {
                reqModule.name = reqModule.name.replace(matchHyphen,
                    function(match) {
                        return match[1].toUpperCase();
                    }); 
            }  
        }
    });
    return modules;
}

module.exports = loader;