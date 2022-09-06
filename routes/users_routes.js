const express = require('express');
const {
  getUser,
  registerUser,
  updateUser,
  deleteUser,
} = require('../controllers/user_controller');

const { protect } = require('../middleware/auth_middleware');

const userRouter = require('./admin_routes');

const router = express.Router();

// Re-route into other resource routers (routes/admin_route)
router.use('/admin', userRouter);

// Route = /api/v1/users
router.get('/getme', protect, getUser);
router.post('/', registerUser);
router.put('/updateme', protect, updateUser);
router.delete('/deleteme', protect, deleteUser);

module.exports = router;
