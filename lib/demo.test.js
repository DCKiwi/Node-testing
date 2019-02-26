const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');
const demo = require('./demo');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);


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

    is('should stub console.warn', () => {
      let stub = sinon.stub(console, 'warn');
    })
  });
});
