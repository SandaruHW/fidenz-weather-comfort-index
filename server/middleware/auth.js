// Optional: JWT middleware for API protection
// Uncomment and configure if you want to protect API endpoints with Auth0 tokens

const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Auth0 JWT verification middleware
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

module.exports = { checkJwt };