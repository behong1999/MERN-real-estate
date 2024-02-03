import express from 'express';
import {
  signIn,
  google,
  signOut,
  signUp,
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/google', google);
router.get('/signout', signOut);

export default router;
