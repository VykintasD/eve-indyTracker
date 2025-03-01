import express from 'express';
import AuthController from '../controllers/authController';

const router = express.Router();
const authController = new AuthController();

router.get('/', authController.initiateSSO);
router.get('/callback', async (req, res) => {
  await authController.handleEsiCallback(req, res);
});

export default router;
