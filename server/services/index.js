'use strict';
var loader = require(__base + 'server/configuration').loader;
var path = __base + 'server/services';
module.exports = loader(path, {removeAfterHyphen:false});