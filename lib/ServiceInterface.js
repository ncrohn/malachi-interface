var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    _ = require('underscore'),
    sio = require('socket.io-client');

var SYSTEM_EVENTS = {
  VERIFY: 'verify',
  REGISTERED: 'registered',
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

  var self = this;

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
    socket.on(SYSTEM_EVENTS.REGISTERED, handleRegistered);
    socket.on(SERVICE_EVENTS.DISCONNECT, handleDisconnect);
  }

  function handleVerify() {
    socket.emit(SERVICE_EVENTS.REGISTER, registration);
  }

  function handleRegistered() {
    socket.emit(SERVICE_EVENTS.CONNECT);
    SI.emit(SERVICE_EVENTS.CONNECT);
  }

  function handleDisconnect() {
    SI.emit(SERVICE_EVENTS.DISCONNECT);
  }

  var SI = {

    // EventEmitter Methods
    addListener: this.addListener,
    on: this.on,
    once: this.once,
    removeListener: this.removeListener,
    removeAllListeners: this.removeAllListeners,
    emit: this.emit,
    listeners: this.listeners,

    connect: function() {
      if(!socket) {
        socket = sio.connect(systemUrl);
        attachListeners();
      } else {
        // Warn them that they are calling connect multiple times
      }
    },

    disconnect: function() {
      socket.emit('will disconnect');
    }
  };

  return SI;

};

ServiceInterface.SYSTEM_EVENTS = SYSTEM_EVENTS;
ServiceInterface.SERVICE_EVENTS = SERVICE_EVENTS;

util.inherits(ServiceInterface, EventEmitter);

module.exports = ServiceInterface;