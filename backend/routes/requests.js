const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', requestController.getAllRequests);
router.get('/calendar', requestController.getCalendarRequests);
router.get('/dashboard/stats', requestController.getDashboardStats);
router.get('/:id', requestController.getRequestById);
router.post('/', requestController.createRequest);
router.put('/:id', requestController.updateRequest);
router.delete('/:id', requestController.deleteRequest);
router.post('/:id/comments', requestController.addComment);

module.exports = router;
