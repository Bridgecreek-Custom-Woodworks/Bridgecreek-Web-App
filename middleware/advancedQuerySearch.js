const { Op } = require('sequelize');
const User = require('../models/User');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Products = require('../models/Product');
const Reviews = require('../models/Reviews');
const Wishlist = require('../models/Wishlist');

const advancedQuerySearch = (Model) => async (req, res, next) => {
  let query = {};
  query['subQuery'] = true;

  let queryField;
  let fieldValue;

  let queryStr = JSON.stringify(req.query);
  let match = queryStr.match(/[a-z]*(lte|gte|lt|gt)/i);

  if (match) {
    queryField = match[0].replace(match[1], '');
    fieldValue = req.query[match[0]];

    if (match[1] === 'gte') {
      query['where'] = { [queryField]: { [Op.gte]: fieldValue } };
    } else if (match[1] === 'gt') {
      query['where'] = { [queryField]: { [Op.gt]: fieldValue } };
    } else if (match[1] === 'lte') {
      query['where'] = { [queryField]: { [Op.lte]: fieldValue } };
    } else if (match[1] === 'lt') {
      query['where'] = { [queryField]: { [Op.lt]: fieldValue } };
    }
  }

  // Coping req.query for the if statement below
  let reqQuery = { ...req.query };

  if (!query.where || !query.where) {
    // Coping req.query for the if statement below
    reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = [
      'attributes',
      'limit',
      'offset',
      'page',
      'order',
      'include',
    ];

    // Loop over removeFields and delete them from req.query
    removeFields.forEach((param) => delete req.query[param]);
    query['where'] = req.query;
  }

  if (reqQuery.attributes) {
    // Turn attributes values from string into array
    const attributesArr = reqQuery.attributes[0].split(',');
    query['attributes'] = attributesArr;
  }

  if (reqQuery.order) {
    // Turn order values from string into array
    const orderArr = reqQuery.order[0].split(',');
    query['order'] = [[orderArr]];
  }

  // Pagination
  const page = parseInt(reqQuery.page, 10) || 1;
  const limit = parseInt(reqQuery.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Model.count();

  // Pagination result
  const pagination = {};

  // Add limit and offset to query being returned for pagination
  if (reqQuery.offset || reqQuery.limit) {
    query.subQuery = false;
    query['offset'] = startIndex;
    query['limit'] = reqQuery.limit ? reqQuery.limit : 10;
  }

  if (reqQuery.include === 'true') {
    query['include'] = { all: true };
  }

  // Working on more advanced and selective include query. Remove after testing  ***********

  if (reqQuery.include && reqQuery.include.startsWith('model')) {
    query['include'] = [];
    const includeArry = reqQuery.include.split(',');

    for (let i = 0; i < includeArry.length; i++) {
      if (includeArry[i] === 'users') {
        query['include'].push({ model: User });
      } else if (includeArry[i] === 'carts') {
        query['include'].push({ model: Cart });
      } else if (includeArry[i] === 'cartitems') {
        query['include'].push({ model: CartItem });
      } else if (includeArry[i] === 'products') {
        query['include'].push({ model: Products });
      } else if (includeArry[i] === 'reviews') {
        query['include'].push({ model: Reviews });
      } else if (includeArry[i] === 'wishlist') {
        query['include'].push({ model: Wishlist });
      }
    }
  }

  query = Model.findAll(query);

  const results = await query;

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // Need to work on returning the model associations to the client for dynamic drop down (include: model)
  let modelAssociations = Object.values(Model.associations);
  req.modelAssociations = modelAssociations;

  res.advancedQuerySearch = {
    success: true,
    count: results.length,
    pagination,
    data: results,
    // modelAssociations,
  };

  next();
};

module.exports = advancedQuerySearch;

// let str = JSON.stringify(req.query);
// let match = str.match(/[a-z]*(lte|gte|lt|gt)/i);

// if (match) {
//   return next((query = queryGt_e_Lt_e(query, req.query, match, next)));
// }

// Still working on implementing this. *************
const queryGt_e_Lt_e = (query, reqQuery, match, next) => {
  let queryField;
  let fieldValue;

  console.log('Match', match);
  console.log('Query', reqQuery);

  queryField = match[0].replace(match[1], '');

  fieldValue = reqQuery[match[0]];

  if (match[1] === 'gte') {
    console.log('QueryField', queryField);

    return next((query['where'] = { [queryField]: { [Op.gte]: fieldValue } }));
  } else if (match[1] === 'gt') {
    return (query['where'] = { [queryField]: { [Op.gt]: fieldValue } });
  } else if (match[1] === 'lte') {
    return (query['where'] = { [queryField]: { [Op.lte]: fieldValue } });
  } else if (match[1] === 'lt') {
    return (query['where'] = { [queryField]: { [Op.lt]: fieldValue } });
  }
};
