const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const rewire = require('rewire');

// Call with rewire
var demo = rewire('./demo');


describe('demo', () => {
  context('add', () => {
    it('should add two numbers', () => {
      expect(demo.add(1, 2)).to.equal(3);
    });
  });

  context('callback add', () => {
    it('should test the callback', (done) => {
      demo.addCallback(1, 2, (err, result) => {
        expect(err).to.not.exist;
        expect(result).to.equal(3);
        done();
      });
    });
  });

  context('test promise', () => {
    it('add with a promise cb', (done) => {
      demo.addPromise(1, 2).then((result) => {
        expect(result).to.equal(3);
        done();
      });
    });
  });

  context('test promise v2', () => {
    it('add with promise cb async/await', async () => {
      let data = await demo.addPromise(1, 2);
      expect(data).to.equal(3);
    });
  });

  context('test doubles', () => {
    it('should spy on log', () => {
      let spy = sinon.spy(console, 'log');
      demo.foo();

      expect(spy.calledOnce).be.true;
      expect(spy).to.have.been.calledOnce;
      spy.restore();
    });

    it('should stub console.warn', () => {
      // blocks method from being called and calls own.
      let stub = sinon.stub(console, 'warn').callsFake(() => { console.log('message from stub') });
      demo.foo();

      expect(stub).to.have.been.calledOnce;
      expect(stub).to.have.been.calledWith('console.warn was called');
      stub.restore();
    });
  });

  context('stub private functions', () => {
    it('should stub createFile', async () => {
      let createStub = sinon.stub(demo, 'createFile').resolves('create_stub');
      let callStub = sinon.stub().resolves('calldb_stub');

      demo.__set__('callDB', callStub);

      let result = await demo.bar('test.txt');

      expect(result).to.equal('calldb_stub');
      expect(createStub).to.have.been.calledOnce;
      expect(createStub).to.have.been.calledWith('test.txt');
      expect(callStub).to.have.been.calledOnce;
    });
  });
});
