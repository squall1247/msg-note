const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller Test - Login', function() {
    it('should throw an error with code 500 if accessing the database fails', function(done){
        sinon.stub(User, 'findOne');
        User.findOne.throws();
    
        const req = {
            body: {
                email: 'test@gtest.com',
                password: 'testerpwd'
            }
        };
        
        AuthController.login(req, {}, ()=>{})
            .then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            })
            .catch(err => done(err));

        User.findOne.restore();
    });
});
