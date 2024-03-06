import express from 'express';
import { deleteUser, getUser, getUserListings, test, updateUser } from '../controllers/user.controller';
import { verifyToken } from '../utils/verifyUser';


const router = express.Router();

router.get('/test',test);
router.get('/:id', verifyToken, getUser)
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListings)

export default router;
