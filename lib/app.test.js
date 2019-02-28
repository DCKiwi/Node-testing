const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');
const chaiAsPromised = require('chai-as-promised');
const request = require('supertest');
const { expect } = chai;

chai.use(sinonChai);
chai.use(chaiAsPromised);

var app = rewire('./app');
const users = require('./users');
const auth = require('./auth');
const sandbox = sinon.createSandbox();

describe('app', () => {

  // beforeEach(() => {
  //   mongooseStub = sandbox.stub().resolves('done');
  //   app.__set__('mongoose.connect(db())', mongooseStub)
  // });

  afterEach(() => {
    app = rewire('./app');
    sandbox.restore();
  });

  context('GET /', () => {
    it('should get /', (done) => {
      request(app).get('/')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('name').to.equal('Foo Fooing Bar');
          done(err);
        });
    });
  });

  context('POST /user', () => {
    let createStub, errorStub;

    it('should call user.create', (done) => {
      createStub = sandbox.stub(users, 'create').resolves({ name: 'foo' });

      request(app).post('/user')
        .send({ name: 'fake' })
        .expect(200)
        .end((err, res) => {
          expect(createStub).to.have.been.calledOnce;
          expect(res.body).to.have.property('name').to.equal('foo');
          done(err);
        });
    });

    it('should call handleError on error', (done) => {
      createStub = sandbox.stub(users, 'create').rejects(new Error('fake_error'));

      errorStub = sandbox.stub().callsFake((res, error) => {
        return res.status(400).json({ error: 'fake' });
      })

      app.__set__('handleError', errorStub);

      request(app).post('/user')
        .send({ name: 'fake' })
        .expect(400)
        .end((err, res) => {
          expect(createStub).to.have.been.calledOnce;
          expect(errorStub).to.have.been.calledOnce;
          expect(res.body).to.have.property('error').to.equal('fake');
          done(err);
        });
    });
  });


});
