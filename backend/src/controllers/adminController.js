const User = require('../models/User');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort('-createdAt');
    return res.status(200).json({ success: true, message: 'Users fetched successfully', data: users });
  } catch (error) {
    return next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, message: 'User fetched successfully', data: user });
  } catch (error) {
    return next(error);
  }
};

exports.banUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, message: 'User banned successfully', data: user });
  } catch (error) {
    return next(error);
  }
};

exports.unbanUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, message: 'User unbanned successfully', data: user });
  } catch (error) {
    return next(error);
  }
};

exports.changeUserRole = async (req, res, next) => {
  try {
    const role = req.body?.role;
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be admin or user.' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, message: 'User role updated successfully', data: user });
  } catch (error) {
    return next(error);
  }
};

exports.systemHealth = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'System health fetched successfully',
      data: { status: 'ok', uptimeSeconds: Math.round(process.uptime()), timestamp: new Date().toISOString() }
    });
  } catch (error) {
    return next(error);
  }
};

exports.systemLogs = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, message: 'System logs endpoint available', data: [] });
  } catch (error) {
    return next(error);
  }
};

exports.securityEvents = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, message: 'Security events endpoint available', data: [] });
  } catch (error) {
    return next(error);
  }
};
