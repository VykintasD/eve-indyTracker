import express from 'express';
import CharacterController from '../controllers/characterController';

const router = express.Router();
const characterController = new CharacterController();

router.get(
  '/characters',
  characterController.getCharacters.bind(characterController)
);

export default router;
