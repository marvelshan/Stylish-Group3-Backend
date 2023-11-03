import { Router } from 'express';
import {
  addCoupon,
  addCouponToUserCouponWallet,
  getCoupons,
  getUserCoupons,
  getUserInvalidCoupons,
} from '../controllers/coupon.js';

const router = Router();

// user
router.route('/v1/coupons').get(getUserCoupons);
router.route('/v1/coupons').post(addCouponToUserCouponWallet);
router.route('/v1/invalid-coupons/').get(getUserInvalidCoupons);

// admin
router.route('/marketing/coupons').get(getCoupons);
router.route('/marketing/coupons').post(addCoupon);

export default router;
