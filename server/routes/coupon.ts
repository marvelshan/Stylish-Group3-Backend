import { Router } from "express";
import {
  addCoupon,
  addCouponToUserCouponWallet,
  getCoupons,
  getUserCoupons,
  getUserInvalidCoupons,
} from "../controllers/coupon.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

// user
router.route("/v1/coupons").get(getUserCoupons);
router.route("/v1/coupons").post(addCouponToUserCouponWallet);
router.route("/v1/invalid-coupons/").get(getUserInvalidCoupons);

// admin
router.route("/marketing/coupons").get(authenticate, getCoupons);
router.route("/marketing/coupons").post(authenticate, addCoupon);

export default router;
