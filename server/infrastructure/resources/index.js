'use strict';
var loader = require(__base + 'server/configuration').loader;
var path = __base + 'server/infrastructure/resources';
module.exports = loader(path, {removeAfterHyphen:true});