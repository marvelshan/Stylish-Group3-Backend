import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import { addComments, getProductComments } from "../controllers/comment.js";

const router = Router();

router.route("/v1/comments").get(getProductComments);
router.route("/v1/comment").post(authenticate, addComments);

export default router;
