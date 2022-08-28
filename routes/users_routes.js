const express = require('express')
const router = express.Router()
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user_controller')

// Route prefix /api/v1/users

router.get('/', getAllUsers)
router.get('/:userId', getUser)
router.post('/', createUser)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)
module.exports = router
