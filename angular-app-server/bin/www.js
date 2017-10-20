#!/usr/bin/env node
var debug = require('debug')('Angular App Serv');
//var app = require('../app');
var app = require('../dest/app').Server.bootstrap().app;

app.set('port', process.env.PORT || 2041 );

var server = app.listen(app.get('port') , function(){
    console.log('Express bin listening on port' + server.address().port);
});