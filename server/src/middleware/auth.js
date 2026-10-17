const jwt = require('jsonwebtoken');
const db = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'careerflow_super_secure_jwt_secret_key_2026_xyz';

function authenticate(req, res, next) {
  let token = null;

  // Read from httpOnly cookie or Authorization header
  if (req.cookies && req.cookies.careerflow_token) {
    token = req.cookies.careerflow_token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.'
    });
  }
}

// Optional authentication for public endpoints that benefit from user context (like jobs list)
function optionalAuth(req, res, next) {
  let token = null;

  if (req.cookies && req.cookies.careerflow_token) {
    token = req.cookies.careerflow_token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(decoded.userId);
      if (user) {
        req.user = user;
      }
    } catch (e) {
      // Ignore token failure in optionalAuth
    }
  }

  next();
}

module.exports = {
  authenticate,
  optionalAuth,
  JWT_SECRET
};
