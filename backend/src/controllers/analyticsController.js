const Law = require('../models/Law');

exports.getMostViewed = async (req, res, next) => {
  try {
    const data = await Law.find({}).sort('-views').limit(10);
    return res.status(200).json({ success: true, message: 'Most viewed laws fetched successfully', data });
  } catch (error) {
    return next(error);
  }
};

exports.getMostBookmarked = async (req, res, next) => {
  try {
    const data = await Law.find({}).sort('-bookmarkCount').limit(10);
    return res.status(200).json({ success: true, message: 'Most bookmarked laws fetched successfully', data });
  } catch (error) {
    return next(error);
  }
};

exports.getByCategory = async (req, res, next) => {
  try {
    const data = await Law.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } }
    ]);
    return res.status(200).json({ success: true, message: 'Laws by category fetched successfully', data });
  } catch (error) {
    return next(error);
  }
};

exports.getByState = async (req, res, next) => {
  try {
    const data = await Law.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } }
    ]);
    return res.status(200).json({ success: true, message: 'Laws by state fetched successfully', data });
  } catch (error) {
    return next(error);
  }
};

exports.getByCourt = async (req, res, next) => {
  try {
    const data = await Law.aggregate([
      { $match: { court: { $exists: true, $ne: '' } } },
      { $group: { _id: '$court', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } }
    ]);
    return res.status(200).json({ success: true, message: 'Laws by court fetched successfully', data });
  } catch (error) {
    return next(error);
  }
};

exports.getRecentUpdates = async (req, res, next) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const data = await Law.find({ updatedAt: { $gte: since } }).sort('-updatedAt').limit(50);
    return res.status(200).json({ success: true, message: 'Recent law updates fetched successfully', data });
  } catch (error) {
    return next(error);
  }
};

exports.getPopularity = async (req, res, next) => {
  try {
    const data = await Law.aggregate([
      {
        $project: {
          sectionNumber: 1,
          title: 1,
          views: 1,
          bookmarkCount: 1,
          popularityScore: { $add: ['$views', '$bookmarkCount'] }
        }
      },
      { $sort: { popularityScore: -1, views: -1 } },
      { $limit: 20 }
    ]);
    return res.status(200).json({ success: true, message: 'Law popularity metrics fetched successfully', data });
  } catch (error) {
    return next(error);
  }
};

exports.getComplexity = async (req, res, next) => {
  try {
    const data = await Law.aggregate([
      {
        $group: {
          _id: { $ifNull: ['$punishmentType', 'Unspecified'] },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1, _id: 1 } }
    ]);
    return res.status(200).json({ success: true, message: 'Law complexity distribution fetched successfully', data });
  } catch (error) {
    return next(error);
  }
};
