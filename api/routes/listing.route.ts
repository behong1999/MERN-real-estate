import {
  createListing,
  deleteListing,
  getListing,
  getListings,
  updateListing,
} from '../controllers/listing.controller';
import { verifyToken } from '../utils/verifyUser';

const router = require('express').Router();

router.post('/create', verifyToken, createListing);
router.get('/get/:id', getListing);
router.post('/update/:id', verifyToken, updateListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.get('/get', getListings);

export default router;
