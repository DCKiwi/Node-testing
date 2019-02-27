const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');
const mongoose = require('mongoose');
const chaiAsPromised = require('chai-as-promised');

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiAsPromised);

const users = require('./users');
const User = require('./models/user');

const sandbox = sinon.createSandbox();

describe('users', () => {
  let findStub;
  let sampleArgs;

  beforeEach(() => {
    sampleUser = {
      id: 123,
      name: 'foo',
      email: 'foo@bar'
    };

    findStub = sandbox.stub(mongoose.Model, 'findById').resolves(sampleUser);
    deleteStub = sandbox.stub(mongoose.Model, 'remove').resolves('fake_remove_result');

  });

  afterEach(() => {
    sandbox.restore();
  });

  context('get', () => {
    it('should check for an id', (done) => {
      users.get(null, (err, result) => {
        expect(err).to.exist;
        expect(err.message).to.equal('Invalid user id');
        done();
      })
    })

    it('should call findUserByID with id and return result', (done) => {
      sandbox.restore();
      let stub = sandbox.stub(mongoose.Model, 'findById').yields(null, { name: 'foo' });

      users.get(123, (err, result) => {
        expect(err).to.not.exist;
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(123);
        expect(result).to.be.a('object');
        expect(result).to.have.property('name').to.equal('foo');

        done();
      });
    });

    it('should catch error if there is one', (done) => {
      sandbox.restore();
      let stub = sandbox.stub(mongoose.Model, 'findById').yields(new Error('fake'));

      users.get(123, (err, result) => {
        expect(result).to.not.exist;
        expect(err).to.exist;
        expect(err).to.be.instanceOf(Error);
        expect(stub).to.have.been.calledWith(123);
        expect(err.message).to.equal('fake');

        done();
      });
    });
  });

  context('delete user', () => {
    it('should call User.remove', async () => {
      let result = await users.delete(123);

      expect(result).to.equal('fake_remove_result');
      expect(deleteStub).to.have.been.calledWith({ _id: 123 });
    });

    it('should check for an id', async () => {
      try {
        let result = await users.delete();
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.equal('Invalid id');
      }
    });
  });

  context('create user', () => {
    it('should reject invalid args', async () => {
      await expect(users.create()).to.eventually.be.rejectedWith('Invalid arguments');
      await expect(users.create({ name: 'foo' })).to.eventually.be.rejectedWith('Invalid arguments');
      await expect(users.create({ email: 'foo@bar.com' })).to.eventually.be.rejectedWith('Invalid arguments');
    });
  });
});