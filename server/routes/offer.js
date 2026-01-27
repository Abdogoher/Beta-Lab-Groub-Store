import express from "express";
import {
  getAllOffers,
  createOffer,
  deleteOffer,
} from "../controllers/offerController.js";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
const router = express.Router();

router.get("/", getAllOffers);

router.use(authMiddleware);
router.post("/", upload.single("image"), createOffer);
router.delete("/:id", deleteOffer);

export default router;
