/**
 * Created by Ronald Lobo.
 */
'use strict';
var _ = require('lodash');
var loader = require(__base + 'server/configuration').loader;
var path = __base + 'server/routes/api/./';
var apiRoutes = loader(path, {removeAfterHyphen:true});

function initializer(router, basePath) {
    _.each(apiRoutes, function(value, key, list) {
        router.use(basePath + '/' + key, value);
    });
}

module.exports = initializer;