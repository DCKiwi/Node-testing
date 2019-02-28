const chai = require('chai');
const expect = chai.expect;

var User = require('./user');

describe('User model', () => {
    it('should return error if required fields are missing', (done) => {
        let user = new User();

        // validate() is a built in mongoose function, if any problems will return object
        user.validate((err) => {
            expect(err.errors.name).to.exist;
            expect(err.errors.email).to.exist;
            expect(err.errors.age).to.not.exist;

            done();
        })
    })

    it('should have optional age field', (done) => {
        let user = new User({
            name: 'foo',
            email: 'foo@bar.com',
            age: 35
        })

        expect(user).to.have.property('age').to.equal(35);
        done();
    })
})