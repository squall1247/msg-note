const expect = require('chai').expect;

const authMiddleware = require('../middleware/is-auth');

describe('Auth middleware test', function() {
    it ('Should throw an error if no authorization header is present', function() {
        const req = {
            get: function(headerName) {
                return null;
            }
        };
        expect(authMiddleware.bind(this, req, {}, ()=>{})).to.throw('Not authenticated.');
    });
    
    it ('Should throw an error if the authorization header is only one string', function() {
        const req = {
            get: function(headerName) {
                return 'xyz';
            }
        };
        expect(authMiddleware.bind(this, req, {}, ()=>{})).to.throw();
    });
});
