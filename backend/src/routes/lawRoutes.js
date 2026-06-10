const express = require('express');
const {
  getAllLaws,
  getRecentLaws,
  getTrendingLaws,
  getArchivedLaws,
  searchLaws,
  filterByAct,
  filterByCategory,
  filterByState,
  filterByCourt,
  filterByStatus,
  filterByBailable,
  filterByCognizable,
  filterByChapter,
  filterBySection,
  getLawStats,
  getLawById,
  getLawExistsById,
  getRandomLaw,
  getLawSummary,
  getLawHistory,
  createLaw,
  updateLaw,
  archiveLaw,
  restoreLaw,
  deleteLaw
} = require('../controllers/lawController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Mount modular sub-filters route
router.use('/filter', require('./filterRoutes'));

// Basic Collection Queries & Operations
router.get('/stats/overview', getLawStats);
router.get('/recent', getRecentLaws);
router.get('/trending', getTrendingLaws);
router.get('/archived', getArchivedLaws);
router.get('/random', getRandomLaw);
router.get('/search/laws', searchLaws);
router.get('/filter/act/:actName', filterByAct);
router.get('/filter/chapter/:chapterId', filterByChapter);
router.get('/filter/section/:sectionNumber', filterBySection);
router.get('/filter/state/:state', filterByState);
router.get('/filter/court/:courtName', filterByCourt);
router.get('/filter/status/:status', filterByStatus);
router.get('/filter/category/:category', filterByCategory);
router.get('/filter/bailable/:value', filterByBailable);
router.get('/filter/cognizable/:value', filterByCognizable);
router.route('/').get(getAllLaws).post(protect, authorize('admin'), createLaw);
router.get('/exists/:id', getLawExistsById);
router.get('/:id/history', getLawHistory);
router.get('/:id/summary', getLawSummary);
router.patch('/:id/archive', protect, authorize('admin'), archiveLaw);
router.patch('/:id/restore', protect, authorize('admin'), restoreLaw);
router.route('/:id').get(getLawById).patch(protect, authorize('admin'), updateLaw).delete(protect, authorize('admin'), deleteLaw);

// Collection CRUD Operations
router.route('/')
  .get(getAllLaws)
  .post(protect, authorize('admin'), createLaw);

router.get('/exists/:id', getLawExistsById);
router.get('/:id/history', getLawHistory);
router.get('/:id/summary', getLawSummary);
router.patch('/:id/archive', protect, authorize('admin'), archiveLaw);
router.patch('/:id/restore', protect, authorize('admin'), restoreLaw);

router.route('/:id')
  .get(getLawById)
  .patch(protect, authorize('admin'), updateLaw)
  .delete(protect, authorize('admin'), deleteLaw);

module.exports = router;
