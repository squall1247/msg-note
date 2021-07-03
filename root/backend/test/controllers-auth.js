const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');
const dbsetting = require('../util/dbsetting');
const dbTestUri = dbsetting.dbTestUri;


describe('Auth Controller Test', function() {

    before(function(done) {
        mongoose
          .connect(dbTestUri, { useNewUrlParser: true , useUnifiedTopology: true})
          .then(result => {
            const user = new User({
              email: 'test@test.com',
              password: 'tester',
              name: 'Test',
              posts: [],
              _id: '5c0f66b979af55031b34728a'
            });
            return user.save();
          })
          .then(() => {
            done();
          })
          .catch(done);
      });
    
    beforeEach(function() {});

    afterEach(function() {});

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

    it('should send a response with a valid user status for an existing user', function(done){
        const req = { userId: '5c0f66b979af55031b34728a' };

        const res = {
            statusCode: 555,
            userStatus: null,
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                this.userStatus = data.status;Y
            }
        };

        AuthController.getUserStatus(req, res, ()=>{}).then(() => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('I am new!');
            done();
        });  
    });

    after(function(done) {
        User.deleteMany({})
          .then(()=>{
              return mongoose.disconnect();
          })
          .then(()=>{
              done();
          })
          .catch(done);
    });
});
