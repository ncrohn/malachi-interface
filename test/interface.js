var assert = require('assert'),
    ServiceBus = require('malachi').ServiceBus,
    ServiceInterface = require('../index').ServiceInterface;


describe('ServiceInterface', function() {

  var si = null, sb = null;

  before(function() {

    sb = new ServiceBus();
    sb.listen(44444);

    si = new ServiceInterface({
      url: 'http://localhost:44444',
      name: 'test-interface',
      version: '0.0.0',
      methods: ['test']
    });
  });

  describe('#methods', function() {

    it('should connect', function(done) {
      si.on(ServiceInterface.SERVICE_EVENTS.CONNECT, function() {
        assert.equal(0, 0);
        done();
      });

      si.connect();
    });

    it('should broadcast', function(done) {
      si.on(ServiceInterface.SYSTEM_EVENTS.BROADCAST, function(message) {
        assert.equal('test message', message);
        done();
      });

      si.broadcast('test message');
    });

    it('should disconnect', function(done) {
      si.on(ServiceInterface.SERVICE_EVENTS.DISCONNECT, function() {
        assert.equal(0, 0);
        done();
      });

      si.disconnect();

    });

  });

});
