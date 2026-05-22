const express = require('express');
const {
  getUsers,
  getUserById,
  banUser,
  unbanUser,
  changeUserRole,
  systemHealth,
  systemLogs,
  securityEvents
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/ban', banUser);
router.patch('/users/:id/unban', unbanUser);
router.patch('/users/:id/role', changeUserRole);
router.get('/system/health', systemHealth);
router.get('/system/logs', systemLogs);
router.get('/security/events', securityEvents);

module.exports = router;
