'use strict';

const service = require('feathers-mongoose');
const menus = require('./menus-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: menus,
    lean: true
  };

  // Initialize our service with any options it requires
  app.use('/menus', service(options));

  // Get our initialize service to that we can bind hooks
  const menusService = app.service('/menus');

  // Set up our before hooks
  menusService.before(hooks.before);

  // Set up our after hooks
  menusService.after(hooks.after);
};
