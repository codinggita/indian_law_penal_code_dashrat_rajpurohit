const express = require('express');
const {
  getAllLaws,
  getLawById,
  createLaw,
  updateLaw,
  deleteLaw
} = require('../controllers/lawController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(getAllLaws).post(protect, authorize('admin'), createLaw);
router.route('/:id').get(getLawById).patch(protect, authorize('admin'), updateLaw).delete(protect, authorize('admin'), deleteLaw);

module.exports = router;

