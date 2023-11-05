import { Router } from 'express';
import {
  getCollectionItems,
  updateCollection,
} from "../controllers/collection.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

router.route("/v1/collection").get(authenticate, getCollectionItems);
router.route("/v1/collection").post(authenticate, updateCollection);

export default router;
