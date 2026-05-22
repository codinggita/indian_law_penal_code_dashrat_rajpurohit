const Law = require('../models/Law');

exports.getTotalCount = async (req, res, next) => {
  try {
    const total = await Law.countDocuments({});
    return res.status(200).json({ success: true, message: 'Total law count fetched successfully', data: { total } });
  } catch (error) {
    return next(error);
  }
};

exports.getActiveCount = async (req, res, next) => {
  try {
    const total = await Law.countDocuments({ status: 'active' });
    return res.status(200).json({ success: true, message: 'Active law count fetched successfully', data: { total } });
  } catch (error) {
    return next(error);
  }
};

exports.getRepealedCount = async (req, res, next) => {
  try {
    const total = await Law.countDocuments({ status: 'repealed' });
    return res.status(200).json({ success: true, message: 'Repealed law count fetched successfully', data: { total } });
  } catch (error) {
    return next(error);
  }
};

async function groupCount(field, message) {
  const data = await Law.aggregate([
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } }
  ]);
  return { message, data };
}

exports.getByAct = async (req, res, next) => {
  try {
    const result = await groupCount('actName', 'Law count by act fetched successfully');
    return res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    return next(error);
  }
};

exports.getByCategory = async (req, res, next) => {
  try {
    const result = await groupCount('category', 'Law count by category fetched successfully');
    return res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    return next(error);
  }
};

exports.getByState = async (req, res, next) => {
  try {
    const result = await groupCount('state', 'Law count by state fetched successfully');
    return res.status(200).json({ success: true, message: result.message, data: result.data });
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
    return res.status(200).json({ success: true, message: 'Law count by court fetched successfully', data });
  } catch (error) {
    return next(error);
  }
};

exports.getRecentStats = async (req, res, next) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const total = await Law.countDocuments({ createdAt: { $gte: since } });
    return res.status(200).json({ success: true, message: 'Recent law stats fetched successfully', data: { last30Days: total } });
  } catch (error) {
    return next(error);
  }
};

exports.getTrendingStats = async (req, res, next) => {
  try {
    const data = await Law.find({}).sort('-views').limit(10).select('sectionNumber title views');
    return res.status(200).json({ success: true, message: 'Trending law stats fetched successfully', data });
  } catch (error) {
    return next(error);
  }
};

exports.getBookmarkStats = async (req, res, next) => {
  try {
    const total = await Law.aggregate([{ $group: { _id: null, total: { $sum: '$bookmarkCount' } } }]);
    return res.status(200).json({ success: true, message: 'Bookmark stats fetched successfully', data: { totalBookmarks: total[0]?.total || 0 } });
  } catch (error) {
    return next(error);
  }
};
