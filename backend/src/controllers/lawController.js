const mongoose = require('mongoose');
const Law = require('../models/Law');
const lawService = require('../services/lawService');
const ALLOWED_SORT_FIELDS = new Set(['sectionNumber', 'title', 'actName', 'category', 'state', 'createdAt', 'updatedAt']);
const MAX_SEARCH_LENGTH = 80;

function parseBoolean(value) {
  if (value === undefined) return undefined;
  if (String(value).toLowerCase() === 'true') return true;
  if (String(value).toLowerCase() === 'false') return false;
  return undefined;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeSort(sortValue) {
  if (!sortValue || typeof sortValue !== 'string') return 'sectionNumber';
  const field = sortValue.startsWith('-') ? sortValue.slice(1) : sortValue;
  if (!ALLOWED_SORT_FIELDS.has(field)) return 'sectionNumber';
  return sortValue;
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
    const sort = normalizeSort(req.query.sort);

    if (req.query.bailable !== undefined && parseBoolean(req.query.bailable) === undefined) {
      return res.status(400).json({ success: false, message: 'Invalid bailable value. Use true or false.' });
    }
    if (req.query.cognizable !== undefined && parseBoolean(req.query.cognizable) === undefined) {
      return res.status(400).json({ success: false, message: 'Invalid cognizable value. Use true or false.' });
    }
    if (req.query.search && String(req.query.search).length > MAX_SEARCH_LENGTH) {
      return res.status(400).json({ success: false, message: `Search must be at most ${MAX_SEARCH_LENGTH} characters.` });
    }
    if (req.query.search) {
      req.query.search = escapeRegex(String(req.query.search).trim());
    }

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

exports.getLawStats = async (req, res, next) => {
  try {
    const stats = await lawService.getOverviewStats();

    return res.status(200).json({
      success: true,
      message: 'Law stats fetched successfully',
      data: stats
    });
  } catch (error) {
    return next(error);
  }
};
