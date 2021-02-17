const jwt = require('jsonwebtoken');

//REFACTOR – Place secret within env var file, never commit.
const secret = 'secret-key';

const withAuth = function(req, res, next) {
    console.log(req); // Cookie is not in the request
  const token = req.cookies.authCookie;
     

  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
    console.log("No Token Provided!");
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
        console.log("Invalid Token");
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
}

module.exports = withAuth;
