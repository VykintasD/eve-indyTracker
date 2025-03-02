import express from 'express';
import EsiController from '../controllers/esiController';
import AuthController from '../controllers/authController';

const router = express.Router();
const esiController = new EsiController();
const authController = new AuthController();

router.use(
  '/characters/:characterId',
  authController.verifyAndRefreshToken.bind(authController)
);

router.get(
  '/characters/:characterId/wallet',
  esiController.getWallet.bind(esiController)
);

export default router;
