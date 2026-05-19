const Law = require('../models/Law');

async function getOverviewStats() {
  const [totalLaws, byAct, byCategory, byBailable, byCognizable] = await Promise.all([
    Law.countDocuments({}),
    Law.aggregate([
      { $group: { _id: '$actName', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } }
    ]),
    Law.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } }
    ]),
    Law.aggregate([{ $group: { _id: '$bailable', count: { $sum: 1 } } }]),
    Law.aggregate([{ $group: { _id: '$cognizable', count: { $sum: 1 } } }])
  ]);

  return { totalLaws, byAct, byCategory, byBailable, byCognizable };
}

module.exports = {
  getOverviewStats
};
