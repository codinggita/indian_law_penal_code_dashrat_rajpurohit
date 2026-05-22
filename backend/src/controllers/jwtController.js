const jwt = require('jsonwebtoken');

function sign(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

exports.generateToken = async (req, res, next) => {
  try {
    const payload = req.body?.payload || { role: 'user' };
    const token = sign(payload);
    return res.status(200).json({ success: true, message: 'Token generated successfully', data: { token } });
  } catch (error) {
    return next(error);
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.body?.token;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ success: true, message: 'Token verified successfully', data: decoded });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized. Missing bearer token.' });
    }
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const refreshed = sign({ id: decoded.id, role: decoded.role });
    return res.status(200).json({ success: true, message: 'Token refreshed successfully', data: { token: refreshed } });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

exports.revokeToken = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, message: 'Token revoked successfully (stateless stub).' });
  } catch (error) {
    return next(error);
  }
};

exports.jwtProfile = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, message: 'JWT profile fetched successfully', data: req.user });
  } catch (error) {
    return next(error);
  }
};

exports.jwtDashboard = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, message: 'JWT dashboard fetched successfully', data: { role: req.user.role } });
  } catch (error) {
    return next(error);
  }
};

exports.privateLaws = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, message: 'Private laws route access granted' });
  } catch (error) {
    return next(error);
  }
};

exports.privateAnalytics = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, message: 'Private analytics route access granted' });
  } catch (error) {
    return next(error);
  }
};
