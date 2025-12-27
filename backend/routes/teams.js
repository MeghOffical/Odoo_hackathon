const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authMiddleware, authorize } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.post('/', authorize('admin', 'manager'), teamController.createTeam);
router.put('/:id', authorize('admin', 'manager'), teamController.updateTeam);
router.post('/:id/members', authorize('admin', 'manager'), teamController.addTeamMember);
router.delete('/:id/members/:userId', authorize('admin', 'manager'), teamController.removeTeamMember);
router.get('/:id/technicians', teamController.getTeamTechnicians);

module.exports = router;
