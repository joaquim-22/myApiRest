// Imports
var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = '<JWT_SIGN_TOKEN>';

// Exported functions
module.exports = {

    generateTokenForUser: (userData) => {
        return jwt.sign({
            userId: userData.id,
        },
        JWT_SIGN_SECRET,
        {
        expiresIn: '1h'
        })
    },

    parseAuthorization: (authorization) => {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },

    getUserId: (authorization) => {
    
        var userId = -1;
        var token = module.exports.parseAuthorization(authorization);

        if(token != null) {
            try {
                let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);

                if(jwtToken != null) {
                    userId = jwtToken.userId;
                }
            }
            catch(err) { }
        }   
        return userId;
    }
}