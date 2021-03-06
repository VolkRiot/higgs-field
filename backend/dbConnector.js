(function() {
    'use strict';

    var q           = require('Q'),
        rp          = require('request-promise'),
        sqlite      = require('sqlite3').verbose(),
        trans       = require('sqlite3-transactions').TransactionDatabase,
        higgsDB     = new trans(new sqlite.Database('higgs.db')),
        mysql       = require('./mysqlAdapter.js'),
        dbConnector = {};

    dbConnector.connectSingleDB = function(dbID) {
        var d       = q.defer(),
            dbObj   = {},
            options = {
                uri: "http://localhost:3040/get/databases/where/microservices/id/" + dbID,
                json: true // Auto pars JSON in the response
            };

        rp(options).then(function (json) {
            dbObj = json[0];

            switch (dbObj.type) {
                case "mysql":

                    var connection = {
                        status: 'not configured'
                    };

                    mysql.connect(dbObj).then(function(mysql){
                        connection.status = 'connected';
                        d.resolve(connection);
                	}, function() {
                        connection.status = 'not connected';
                        d.reject(connection);
                    });

                    break;

                case "oracle":

                    d.resolve({
                        status: 'not configured'
                    });

                    break;

                case "ms-sql":

                    d.resolve({
                        status: 'not configured'
                    });

                    break;

                case "sqlite":

                    d.resolve({
                        status: 'not configured'
                    });

                    break;

                default:

                    d.resolve({
                        status: 'could not identify db'
                    });
            } // end switch
        });



        return d.promise;
    };

    module.exports = dbConnector;
})();
