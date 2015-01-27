'use strict';

var Dispatcher = require('flux').Dispatcher;

/**
 * We just straight up export the dispatcher. If we want, we could wrap the
 * dispatcher inside an interface which would differentiate the actions from
 * the UI Views and actions that are caused by the Server.
 */
module.exports = new Dispatcher();
