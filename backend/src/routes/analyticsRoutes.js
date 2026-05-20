const express = require('express');
const {
  getMostViewed,
  getMostBookmarked,
  getByCategory,
  getByState,
  getByCourt,
  getRecentUpdates,
  getPopularity,
  getComplexity
} = require('../controllers/analyticsController');

const router = express.Router();

router.get('/laws/most-viewed', getMostViewed);
router.get('/laws/most-bookmarked', getMostBookmarked);
router.get('/laws/by-category', getByCategory);
router.get('/laws/by-state', getByState);
router.get('/laws/by-court', getByCourt);
router.get('/laws/recent-updates', getRecentUpdates);
router.get('/laws/popularity', getPopularity);
router.get('/laws/complexity', getComplexity);

module.exports = router;
