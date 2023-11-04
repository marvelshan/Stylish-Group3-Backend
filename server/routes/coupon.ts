import { Router } from 'express';
import {
  addCoupon,
  addCouponToUserCouponWallet,
  getCoupons,
  getUserCoupons,
  getUserInvalidCoupons,
} from '../controllers/coupon.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

// user
router.route('/v1/coupons').get(authenticate, getUserCoupons);
router.route('/v1/coupons').post(authenticate, addCouponToUserCouponWallet);
router.route('/v1/invalid-coupons/').get(authenticate, getUserInvalidCoupons);

// admin
router.route('/marketing/coupons').get(getCoupons);
router.route('/marketing/coupons').post(addCoupon);

export default router;
