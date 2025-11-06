// middleware/auth.js

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Get the token from the request header
  // On the frontend, you'll send this as {'x-auth-token': 'your_token_here'}
  const token = req.header('x-auth-token');

  // 2. If no token, deny access
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. If token exists, verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add the user (from the token's payload) to the request object
    // Now all protected routes will have access to req.admin
    req.admin = decoded.admin;
    
    next(); // Move on to the next function (the actual route)
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};