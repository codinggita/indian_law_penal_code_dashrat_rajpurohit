const express = require('express');
const {
  getAllLaws,
  getLawById,
  createLaw,
  updateLaw,
  deleteLaw
} = require('../controllers/lawController');

const router = express.Router();

router.route('/').get(getAllLaws).post(createLaw);
router.route('/:id').get(getLawById).patch(updateLaw).delete(deleteLaw);

module.exports = router;

