var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    _ = require('underscore'),
    sio = require('socket.io-client');

var SYSTEM_EVENTS = {
  VERIFY: 'verify',
  BROADCAST: 'broadcast message',
  SERVICE_CONNECT: 'service connect',
  SERVICE_ONLINE: 'service online',
  SERVICE_DISCONNECT: 'service disconnect',
  SERVICE_OFFLINE: 'service offline'
};

var SERVICE_EVENTS = {
  REGISTER: 'register',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect'
};

var ServiceInterface = function(config) {
  EventEmitter.call(this);

  var systemUrl = config.url || '';
  var socket = null;

  var registration = {
    name: config.name || null,
    version: config.version || null,
    methods: config.methods || []
  };

  function attachListeners() {
    if(!socket) throw new Error('Socket must be created before setting listeners');
    socket.on(SYSTEM_EVENTS.VERIFY, handleVerify);
  }

  function handleVerify() {
    socket.emit(SERVICE_EVENTS.REGISTER, registration);
  }

  var SI = _.extend(EventEmitter, {
    connect: function() {
      if(!socket) {
        socket = sio.connect(systemUrl);
        attachListeners();
      } else {
        // Warn them that they are calling connect multiple times
      }
    }
  });

  return SI;

};

_.inherits(ServiceInterface, EventEmitter);

module.exports = ServiceInterface;
module.exports.SYSTEM_EVENTS = SYSTEM_EVENTS;
module.exports.SERVICE_EVENTS = SERVICE_EVENTS;