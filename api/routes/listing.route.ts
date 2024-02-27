import { createListing } from "../controllers/listing.controller";
import { verifyToken } from "../utils/verifyUser";

const router = require('express').Router();

router.post('/create', verifyToken, createListing);
// router.delete('/delete/:id', verifyToken, deleteListing);
// router.post('/update/:id', verifyToken, updateListing);
// router.get('/get/:id', getListing);
// router.get('/get', getListings);

export default router;
