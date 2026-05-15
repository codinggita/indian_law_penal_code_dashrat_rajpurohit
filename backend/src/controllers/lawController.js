const mongoose = require('mongoose');
const Law = require('../models/Law');

function parseBoolean(value) {
  if (value === undefined) return undefined;
  if (String(value).toLowerCase() === 'true') return true;
  if (String(value).toLowerCase() === 'false') return false;
  return undefined;
}

function buildFilters(query) {
  const filters = {};

  if (query.act) filters.actName = query.act;
  if (query.category) filters.category = query.category;
  if (query.state) filters.state = query.state;

  const bailable = parseBoolean(query.bailable);
  if (bailable !== undefined) filters.bailable = bailable;

  const cognizable = parseBoolean(query.cognizable);
  if (cognizable !== undefined) filters.cognizable = cognizable;

  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filters.$or = [
      { title: regex },
      { description: regex },
      { actName: regex },
      { category: regex }
    ];
  }

  return filters;
}

exports.getAllLaws = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;
    const sort = req.query.sort || 'sectionNumber';

    const filters = buildFilters(req.query);

    const [laws, total] = await Promise.all([
      Law.find(filters).sort(sort).skip(skip).limit(limit),
      Law.countDocuments(filters)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Laws fetched successfully',
      data: laws,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.getLawById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid law id' });
    }

    const law = await Law.findById(req.params.id);
    if (!law) {
      return res.status(404).json({ success: false, message: 'Law not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Law fetched successfully',
      data: law
    });
  } catch (error) {
    return next(error);
  }
};

exports.createLaw = async (req, res, next) => {
  try {
    const law = await Law.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Law created successfully',
      data: law
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateLaw = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid law id' });
    }

    const law = await Law.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!law) {
      return res.status(404).json({ success: false, message: 'Law not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Law updated successfully',
      data: law
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteLaw = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid law id' });
    }

    const law = await Law.findByIdAndDelete(req.params.id);
    if (!law) {
      return res.status(404).json({ success: false, message: 'Law not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Law deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    return next(error);
  }
};

