const Users = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async_middleware')
const { sendTokenResponse } = require('../utils/tokenResponse')

// @desc Get all users
// @route GET /api/v1/auth/users
// access Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await Users.findAll()
  const count = users.length
  res.status(200).json({ success: true, count, data: users })
})

// @desc Get single user
// @route GET /api/v1/auth/users/:userId
// access Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await Users.findOne({
    where: { userId: req.user.userId },
  })

  // IF PASSWORD IS NEEDED TO BE RETURNED THEN THIS CAN BE UNCOMMENTED
  // const user = await Users.scope('withPassword').findOne({
  //   where: { userId: req.params.userId },
  // })

  if (!user) {
    return next(
      new ErrorResponse(
        `User not found with the id of ${req.params.userId}`,
        404
      )
    )
  }

  res.status(200).json({ success: true, data: user })
})

// @desc Create user
// @route GET /api/v1/auth/users
// access Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const user = await Users.create(req.body)

  sendTokenResponse(user, 201, res)
})

// @desc Update user
// @route PUT /api/v1/auth/users/:userId
// access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await Users.update(req.body, {
    where: {
      userId: req.user.userId,
    },
  })
  if (!user) {
    return next(
      new ErrorResponse(`User not found with the id of ${req.user.userId}`, 404)
    )
  }
  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc Update user
// @route DELETE /api/v1/auth/users/:userId
// access Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await Users.destroy({
    where: {
      userId: req.user.userId,
    },
  })

  if (!user) {
    return next(
      new ErrorResponse(
        `User not found with the id of ${req.params.userId}`,
        404
      )
    )
  }
  res.status(200).json({
    success: true,
    msg: `User with the id ${req.user.userId} was deleted`,
  })
})
